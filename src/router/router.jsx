import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../auth/login";
import Test from "../test/test";

// Router'ni yaratamiz
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // asosiy layout (masalan, navbar, footer)
    children: [
      {
        path: "/", // asosiy sahifa
        element: <Test />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
