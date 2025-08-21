import { Outlet, useNavigate } from "react-router-dom";
import { useGetPostsQuery } from "./services/api";
import { useEffect } from "react";
import { notification, Spin } from "antd";

function App() {
  const navigate = useNavigate();
  const marketing1 = localStorage.getItem("marketing1");
  const { data, error, isLoading } = useGetPostsQuery();
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (type, message, description) => {
    api[type]({
      message,
      description,
      placement: "bottomRight",
      duration: 4.5,
    });
  };

  async function checkToken() {
    try {
      const check = await fetch("https://reklamaproject.onrender.com/api/me/", {
        headers: {
          Authorization: `Bearer ${marketing1}`,
        },
      });

      // Agar token yaroqsiz bo‘lsa (401 yoki 403), login sahifasiga yuboramiz
      if (check.status === 401 || check.status === 403) {
        localStorage.removeItem("marketing1"); // eski tokenni o‘chirish
        navigate("/login");
        return;
      }
    } catch (err) {
      openNotification("error", `Kutilmagan xatolik: ${err}`);
      navigate("/login");
    }
  }

  useEffect(() => {
    if (!marketing1) {
      navigate("/login");
    } else {
      checkToken();
    }
  }, [marketing1, navigate]);

  if (isLoading)
    return (
      <div className="w-full h-[100vh] flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  if (error) return <p>Xatolik yuz berdi!</p>;

  return (
    <div>
      {contextHolder}
      <h1>Postlar</h1>
      <ul>
        {data && data.map((post) => <li key={post.author}>{post.author}</li>)}
      </ul>
      <Outlet />
    </div>
  );
}

export default App;
