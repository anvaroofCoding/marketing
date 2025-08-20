import { Outlet, useNavigate } from "react-router-dom";
import { useGetPostsQuery } from "./services/api";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { data, error, isLoading } = useGetPostsQuery();

  async function checkToken() {
    try {
      const check = await fetch(
        "https://reklama-project-3.onrender.com/api/me/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Agar token yaroqsiz bo‘lsa (401 yoki 403), login sahifasiga yuboramiz
      if (check.status === 401 || check.status === 403) {
        localStorage.removeItem("token"); // eski tokenni o‘chirish
        navigate("/login");
        return;
      }

      const checkDatas = await check.json();
      console.log(checkDatas);
    } catch (error) {
      console.error("Token tekshirishda xatolik:", error);
      navigate("/login");
    }
  }

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      checkToken();
    }
  }, [token, navigate]);

  if (isLoading) return <p>Yuklanmoqda...</p>;
  if (error) return <p>Xatolik yuz berdi!</p>;

  return (
    <div>
      <h1>Postlar</h1>
      <ul>
        {data && data.map((post) => <li key={post.author}>{post.author}</li>)}
      </ul>
      <Outlet />
    </div>
  );
}

export default App;
