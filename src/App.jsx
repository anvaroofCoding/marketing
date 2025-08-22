"use client";

import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import logo from "./assets/logo2.png";
import LoginPage from "./auth/login";
import {
  HomeOutlined,
  AppstoreOutlined,
  BugOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  notification,
  Typography,
  Button,
  Dropdown,
  Spin,
} from "antd";
import TashkentMetroMap from "./components/newMapMertopoliten";
import StationDetail from "./components/StationDetail";

const { Content, Sider, Header } = Layout;
const { Title } = Typography;

const MapPage = () => <TashkentMetroMap />;

const XorazmPage = () => (
  <div>
    <Title level={2}>Xorazm</Title>
    <p>Xorazm viloyati ma'lumotlari bu yerda ko'rsatiladi.</p>
  </div>
);

const AndijonPage = () => (
  <div>
    <Title level={2}>Andijon</Title>
    <p>Andijon viloyati ma'lumotlari bu yerda ko'rsatiladi.</p>
  </div>
);

const menuItems = [
  {
    key: "/",
    icon: <HomeOutlined />,
    label: "Xarita",
  },
  {
    key: "ilovalar",
    icon: <AppstoreOutlined />,
    label: "Ilovalar",
    children: [
      {
        key: "/xorazm",
        label: "Xorazm",
      },
      {
        key: "/andijon",
        label: "Andijon",
      },
    ],
  },
];

function AppLayout() {
  const [marketing1, setMarketing1] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [api, contextHolder] = notification.useNotification();
  const [collapsed, setCollapsed] = useState(false);
  const [language, setLanguage] = useState("uz");
  const location = useLocation();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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

  const handleLanguageChange = ({ key }) => {
    setLanguage(key);
    openNotification(
      "success",
      "Til o'zgartirildi",
      `Til ${
        key === "uz" ? "O'zbek" : key === "ru" ? "Rus" : "Ingliz"
      } tiliga o'zgartirildi`
    );
  };

  const languageItems = [
    {
      key: "uz",
      label: "O'zbek",
    },
    {
      key: "ru",
      label: "Русский",
    },
    {
      key: "en",
      label: "English",
    },
  ];

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
      const check = await fetch("https://reklamaproject.onrender.com/api/me/", {
        headers: {
          Authorization: `Bearer ${marketing1}`,
        },
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("marketing1");
      setMarketing1(token);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (!marketing1) {
      navigate("/login");
    } else {
      checkToken();
    }
  }, [marketing1, isLoading]);

  if (isLoading) {
    return (
      <div className="w-full h-[100vh] flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {contextHolder}
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <Sider
            width={250}
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            trigger={null}
            style={{
              background: colorBgContainer,
              boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
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
              }}
            >
              <div className="flex justify-center items-center w-full gap-2">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="marketing metro logo"
                  className="w-[40px]"
                />
                {!collapsed && (
                  <h3 className="text-2xl font-bold text-blue-500">
                    Marketing
                  </h3>
                )}
              </div>
            </div>

            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              style={{
                height: "calc(100% - 80px)",
                borderInlineEnd: 0,
                fontSize: "14px",
              }}
              items={menuItems}
              onClick={handleMenuClick}
            />
          </Sider>

          <Layout style={{ padding: "0" }}>
            <Header
              style={{
                padding: "0 16px",
                background: colorBgContainer,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #f0f0f0",
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
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <Dropdown
                  menu={{
                    items: languageItems,
                    onClick: handleLanguageChange,
                    selectedKeys: [language],
                  }}
                  placement="bottomRight"
                >
                  <Button type="text" icon={<GlobalOutlined />}>
                    {language.toUpperCase()}
                  </Button>
                </Dropdown>

                <Button
                  type="text"
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  danger
                >
                  Chiqish
                </Button>
              </div>
            </Header>

            <div style={{ padding: "0 24px 24px" }}>
              <Breadcrumb
                items={[
                  { title: "Bosh sahifa" },
                  {
                    title: getCurrentPageLabel(),
                  },
                ]}
                style={{ margin: "16px 0" }}
              />
              <Content
                className="h-[80vh]"
                style={{
                  padding: 24,
                  margin: 0,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                  overflow: "hidden",
                }}
              >
                <Routes>
                  <Route path="/" element={<MapPage />} />
                  <Route path="/xorazm" element={<XorazmPage />} />
                  <Route path="/andijon" element={<AndijonPage />} />
                  <Route path="/station/:id" element={<StationDetail />} />
                  <Route path="/station/:id" element={<StationDetail />} />
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
