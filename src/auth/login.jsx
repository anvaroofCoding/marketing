import {
  Button,
  Form,
  Input,
  Card,
  Typography,
  notification,
  Space,
} from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

export default function Login() {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type, message, description) => {
    api[type]({
      message,
      description,
      placement: "bottomRight",
      duration: 4.5,
    });
  };

  const onFinish = async (values) => {
    const res = await axios.post(
      "https://reklama-project-3.onrender.com/api/token/",
      values,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Success:", res);
    openNotification(
      "success",
      "Login Successful!",
      "Welcome back! You have been logged in successfully."
    );
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    openNotification(
      "error",
      "Login Failed",
      "Please check your credentials and try again."
    );
  };

  return (
    <>
      {contextHolder}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4">
        <Card
          className="w-full max-w-md shadow-2xl border-0"
          style={{
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <LoginOutlined className="text-white text-2xl" />
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
    </>
  );
}
