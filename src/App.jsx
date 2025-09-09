import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";
import logo from "./assets/logos.png";
import LoginPage from "./auth/login";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  SnippetsOutlined,
  AimOutlined,
  FieldTimeOutlined,
  BellOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  notification,
  Button,
  Dropdown,
  Spin,
  Badge,
} from "antd";
import TashkentMetroMap from "./components/newMapMertopoliten";
import StationDetail from "./components/StationDetail";
import Positions from "./components/positions";
import Archive from "./components/archive";
import ShowArchive from "./components/show-archive";
import Week from "./pages/week";
import Term from "./pages/term";
import Weekdaitail from "./pages/weekDatails";
// import { useTranslation } from "react-i18next";
import Test from "./test/test";
import { useGetDelaysQuery } from "./services/api";
import Allsearch from "./components/allSearch";
import AllSearchDetails from "./components/allSearchdetails";

const { Content, Sider, Header } = Layout;

const MapPage = () => <TashkentMetroMap />;

function AppLayout() {
  // 🔹 States
  const [marketing1, setMarketing1] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  // const [language, setLanguage] = useState(
  //   localStorage.getItem("lang") || "uz"
  // );

  // 🔹 Router & Translate
  const location = useLocation();
  const navigate = useNavigate();
  // const { i18n } = useTranslation();

  // 🔹 Notification
  const [api, contextHolder] = notification.useNotification();

  // 🔹 RTK Query
  const {
    data: delays,
    isLoading: delysLaoding,
    // error: delayasError,
  } = useGetDelaysQuery();

  // // 🔹 Effects
  // useEffect(() => {
  //   i18n.changeLanguage(language);
  // }, [language, i18n]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("marketing1");
      setMarketing1(token);
      setIsLoading(false);
    }
  }, []);

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  useEffect(() => {
    if (isLoading) return;
    if (!marketing1) {
      navigate("/login");
    } else {
      checkToken();
    }
  }, [marketing1, isLoading]);

  // // 🔹 Functions
  // const handleLanguageChange = ({ key }) => {
  //   setLanguage(key);
  //   i18n.changeLanguage(key);
  //   localStorage.setItem("lang", key);
  // };

  const openNotification = (type, message, description) => {
    api[type]({
      message,
      description,
      placement: "bottomRight",
      duration: 4.5,
    });
  };

  const handleMenuClick = ({ key }) => {
    if (key !== "ilovalar") {
      navigate(key);
      if (typeof window !== "undefined") {
        localStorage.setItem("currentPage", key);
      }
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("marketing1");
      setMarketing1(null);
      navigate("/login");
    }
  };

  const getCurrentPageLabel = () => {
    const currentItem = menuItems.find((item) => {
      if (item.children) {
        return item.children.find((child) => child.key === location.pathname);
      }
      return item.key === location.pathname;
    });

    if (currentItem?.children) {
      const childItem = currentItem.children.find(
        (child) => child.key === location.pathname
      );
      return childItem?.label;
    }

    return currentItem?.label || "Bosh sahifa";
  };

  async function checkToken() {
    if (!marketing1) return;

    try {
      const check = await fetch("http://192.168.10.41:9000/api/me/", {
        headers: {
          Authorization: `Bearer ${marketing1}`,
        },
        credentials: "include",
      });

      if (check.status === 401 || check.status === 403) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("marketing1");
          setMarketing1(null);
        }
        navigate("/login");
      }
    } catch (err) {
      openNotification("error", "Xatolik", `${err}`);
      navigate("/login");
    }
  }

  // 🔹 Theme
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 🔹 Loading States
  if (delysLaoding || isLoading) {
    return (
      <div className="w-full h-[100vh] flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  // 🔹 Delay Stats
  const delayStats = {
    sevenDays: delays?.counts?.haftada_tugaydigan,
    expired: delays?.counts?.tugagan,
  };

  // // 🔹 Menu Items
  // const languageItems = [
  //   {
  //     key: "uz",
  //     label: (
  //       <span style={{ display: "flex", alignItems: "center" }}>
  //         <ReactCountryFlag
  //           countryCode="UZ"
  //           svg
  //           style={{
  //             width: "20px",
  //             height: "15px",
  //             marginRight: "8px",
  //           }}
  //         />
  //         O‘zbek
  //       </span>
  //     ),
  //   },
  //   {
  //     key: "ru",
  //     label: (
  //       <span style={{ display: "flex", alignItems: "center" }}>
  //         <ReactCountryFlag
  //           countryCode="RU"
  //           svg
  //           style={{
  //             width: "20px",
  //             height: "15px",
  //             marginRight: "8px",
  //           }}
  //         />
  //         Русский
  //       </span>
  //     ),
  //   },
  // ];

  const menuItems = [
    {
      key: "/",
      icon: <AimOutlined />,
      label: "Xarita",
    },
    {
      key: "/archive/main/",
      icon: <SnippetsOutlined />,
      label: "Arxiv",
    },
    {
      key: "/umumiy-qidiruv/",
      icon: <FileSearchOutlined />,
      label: "Barcha reklamalar",
    },
    {
      key: "/kechikishlar/",
      icon: (
        <span style={{ color: "white", fontWeight: "bold" }}>
          <FieldTimeOutlined />
        </span>
      ),
      label: (
        <span style={{ color: "white", fontWeight: "bold" }}>Kechikishlar</span>
      ),
      children: [
        {
          key: "/kechikishlar/7kunlik/",
          label: (
            <div className="flex justify-between items-center">
              7 Kunlik
              <Badge
                count={delayStats.sevenDays}
                size="large"
                style={{ backgroundColor: "#fa8c16", marginLeft: 8 }}
              />
            </div>
          ),
        },
        {
          key: "/kechikishlar/tugagan/",
          label: (
            <div className="flex justify-between items-center">
              Muddati tugagan
              <Badge
                count={delayStats.expired}
                size="large"
                style={{ backgroundColor: "#f5222d", marginLeft: 8 }}
              />
            </div>
          ),
        },
      ],
    },
  ];

  // 🔹 Return
  return (
    <div>
      {contextHolder}
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          {/* Sidebar */}
          <Sider
            width={250}
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            breakpoint="lg"
            collapsedWidth="0"
            trigger={null}
            style={{
              boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
              background: "#1559e3",
            }}
          >
            <div
              style={{
                height: "64px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderBottom: "1px solid #f0f0f0",
                marginBottom: "16px",
                background: "#1559e3",
              }}
            >
              <Link to="/">
                <div className="flex justify-center items-center w-full gap-2">
                  <img
                    src={logo || "/placeholder.svg"}
                    alt="marketing metro logo"
                    className="w-[32px] md:w-[40px]"
                  />
                  {!collapsed && (
                    <h3 className="text-xl md:text-2xl font-bold text-white">
                      Marketing
                    </h3>
                  )}
                </div>
              </Link>
            </div>

            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              openKeys={openKeys}
              onOpenChange={onOpenChange} // 🔑 qo‘shildi
              className="custom-menu"
              style={{
                height: "calc(100% - 80px)",
                borderInlineEnd: 0,
                fontSize: "14px",
                background: "#1559e3",
              }}
              items={menuItems}
              onClick={handleMenuClick}
            />
          </Sider>

          {/* Content */}
          <Layout style={{ padding: "0" }}>
            <Header
              className="custom-menu"
              style={{
                padding: "0 16px",
                background: colorBgContainer,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #f0f0f0",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />

              <div
                style={{ display: "flex", alignItems: "center", gap: "20px" }}
              >
                <Badge
                  count={
                    delays.counts.tugagan + delays.counts.haftada_tugaydigan
                  }
                  size="small"
                >
                  <BellOutlined
                    style={{ fontSize: 24, cursor: "pointer" }}
                    onClick={() => setOpenKeys(["/kechikishlar/"])}
                  />
                </Badge>
                {/* <Dropdown
                  menu={{
                    items: languageItems,
                    onClick: handleLanguageChange,
                    selectedKeys: [language],
                  }}
                  placement="bottomRight"
                >
                  <Button type="primary">
                    <ReactCountryFlag
                      countryCode={language === "uz" ? "UZ" : "RU"}
                      svg
                      style={{ width: 20, height: 15, marginRight: 6 }}
                    />
                    {language.toUpperCase()}
                  </Button>
                </Dropdown> */}

                <Button
                  variant="solid"
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  color="red"
                >
                  Chiqish
                </Button>
              </div>
            </Header>

            <div style={{ padding: "0 16px 16px" }}>
              <Breadcrumb
                items={[
                  { title: "Bosh sahifa" },
                  { title: getCurrentPageLabel() },
                ]}
                style={{ margin: "16px 0" }}
              />

              <Content
                className="min-h-[60vh] md:h-[80vh]"
                style={{
                  padding: 16,
                  margin: 0,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                  overflow: "hidden",
                }}
              >
                <Routes>
                  <Route path="/" element={<MapPage />} />
                  <Route path="/station/:id" element={<StationDetail />} />
                  <Route
                    path="/station/:id/position/:ids"
                    element={<Positions />}
                  />
                  <Route path="/archive/main" element={<Archive />} />
                  <Route path="/archive-show/:ida/" element={<ShowArchive />} />
                  <Route path="/kechikishlar/7kunlik" element={<Week />} />
                  <Route path="/kechikishlar/tugagan" element={<Term />} />
                  <Route path="/kechikishlar/:id" element={<Weekdaitail />} />
                  <Route path="/test" element={<Test />} />
                  <Route path="/umumiy-qidiruv/" element={<Allsearch />} />
                  <Route
                    path="/umumiy-qidiruv/:ida"
                    element={<AllSearchDetails />}
                  />
                </Routes>
              </Content>
            </div>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
