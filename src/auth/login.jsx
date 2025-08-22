import {
  Button,
  Form,
  Input,
  Card,
  Typography,
  notification,
  ConfigProvider,
} from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState } from "react";
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
      openNotification("error", "Diqqat!", "Login yoki parol noto‘g‘ri!");
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

  return (
    <ConfigProvider theme={{ zIndexPopupBase: 2000 }}>
      {/* 👉 Notification contextHolder eng tepada turishi kerak */}
      {contextHolder}
      <div className="min-h-screen bg-gray-200 flex justify-center items-center p-4">
        <Card
          className="w-full max-w-md shadow-2xl border-0"
          style={{
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <img src="/logo2.png" alt="marketing metro logo" />
            </div>
            <Title level={2} className="mb-2 text-gray-800">
              Metropoliten marketing
            </Title>
            <Text type="secondary" className="text-base">
              Iltimos login va parolingizni yozing
            </Text>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Username"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item className="mb-6">
              <Button
                loading={loadings[0]}
                onClick={() => enterLoading(0)}
                type="primary"
                htmlType="submit"
                className="w-full h-12 rounded-lg bg-blue-500 hover:bg-blue-600 border-0 text-base font-medium"
                icon={<LoginOutlined />}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </ConfigProvider>
  );
}
