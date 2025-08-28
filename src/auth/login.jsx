"use client";

import {
  Button,
  Form,
  Input,
  Card,
  Typography,
  notification,
  ConfigProvider,
  Space,
  Divider,
} from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function Login() {
  const [api, contextHolder] = notification.useNotification();
  const [loadings, setLoadings] = useState([]);
  const navigate = useNavigate();

  const openNotification = (type, message, description) => {
    api[type]({
      message,
      description,
      placement: "bottomRight",
      duration: 2,
    });
  };

  const onFinish = async (values) => {
    try {
      enterLoading(0);
      const res = await axios.post(
        "http://192.168.10.41:9000/api/token/",
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        openNotification("success", "Login muvaffaqiyatli amalga oshirildi");
        localStorage.setItem("marketing1", res.data.access);
        navigate("/");
      }
    } catch (error) {
      openNotification("error", "Diqqat!", "Login yoki parol noto'g'ri!");
      console.log(error);
    }
  };

  const onFinishFailed = () => {
    openNotification(
      "error",
      "Login Failed",
      "Please check your credentials and try again."
    );
  };

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 3000);
  };

  const customTheme = {
    zIndexPopupBase: 2000,
    token: {
      colorPrimary: "#3b82f6",
      colorPrimaryHover: "#2563eb",
      borderRadius: 12,
      fontSize: 16,
    },
    components: {
      Input: {
        colorBorder: "#d1d5db",
        colorBorderHover: "#3b82f6",
        colorBorderFocus: "#3b82f6",
        controlHeight: 48,
        paddingInline: 16,
        fontSize: 16,
      },
      Button: {
        controlHeight: 48,
        fontSize: 16,
        fontWeight: 600,
      },
      Card: {
        borderRadiusLG: 20,
        paddingLG: 32,
      },
    },
  };

  return (
    <ConfigProvider theme={customTheme}>
      {contextHolder}
      <div className="min-h-screen flex">
        <div className="flex justify-center items-center h-screen w-[50%] bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <DotLottieReact
            src="https://lottie.host/083f29b6-81fd-4e1f-8768-07e84d31dd07/NLgsDNcsqX.lottie"
            loop
            autoplay
            className="w-[80%] relative z-10"
          />
        </div>

        <div className="flex justify-center items-center h-screen w-[50%] bg-gradient-to-br from-gray-50 to-gray-100 p-8">
          <Card
            className="w-full max-w-md shadow-2xl border-0 relative"
            style={{
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            }}
          >
            <div className="text-center mb-10">
              <Space direction="vertical" size="large" className="w-full">
                <div className="w-20 h-20 flex items-center justify-center mx-auto bg-blue-50 rounded-full p-3">
                  <img
                    src="/logo2.png"
                    alt="marketing metro logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <Title
                    level={2}
                    className="mb-2 text-gray-800 font-bold"
                    style={{ fontSize: "28px", marginBottom: "8px" }}
                  >
                    Metropoliten Marketing
                  </Title>
                  <Text type="secondary" className="text-lg font-medium">
                    Marketing dasturi uchun kirish
                  </Text>
                </div>
              </Space>
            </div>

            <Divider className="mb-8" style={{ borderColor: "#e5e7eb" }} />

            <Form
              name="login"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
              size="large"
              className="space-y-6"
            >
              <Form.Item
                label={
                  <Text strong className="text-gray-700 text-base">
                    Foydalanuvchi nomi
                  </Text>
                }
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Iltimos foydalanuvchi nomini kiriting!",
                  },
                ]}
                className="mb-6"
              >
                <Input
                  prefix={<UserOutlined className="text-blue-500 text-lg" />}
                  placeholder="Foydalanuvchi nomini kiriting"
                  className="rounded-xl border-2 hover:border-blue-400 focus:border-blue-500 transition-all duration-200"
                  style={{
                    fontSize: "16px",
                    padding: "12px 16px",
                    height: "48px",
                  }}
                />
              </Form.Item>

              <Form.Item
                label={
                  <Text strong className="text-gray-700 text-base">
                    Parol
                  </Text>
                }
                name="password"
                rules={[
                  { required: true, message: "Iltimos parolni kiriting!" },
                ]}
                className="mb-8"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-blue-500 text-lg" />}
                  placeholder="Parolni kiriting"
                  className="rounded-xl border-2 hover:border-blue-400 focus:border-blue-500 transition-all duration-200"
                  style={{
                    fontSize: "16px",
                    padding: "12px 16px",
                    height: "48px",
                  }}
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  loading={loadings[0]}
                  onClick={() => enterLoading(0)}
                  type="primary"
                  htmlType="submit"
                  className="w-full rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                  icon={<LoginOutlined className="text-lg" />}
                  style={{
                    height: "52px",
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    border: "none",
                    fontSize: "16px",
                  }}
                >
                  Tizimga Kirish
                </Button>
              </Form.Item>
            </Form>

            <div className="text-center mt-8 pt-6 border-t border-gray-100">
              <Text type="secondary" className="text-sm">
                Marketing dasturi - Metropoliten © 2025
              </Text>
            </div>
          </Card>
        </div>
      </div>
    </ConfigProvider>
  );
}
