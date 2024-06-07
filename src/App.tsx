import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./components/login/Login";
import { getUserDetails } from "./spotify";
import SidebarOption from "./components/SidebarOption";

export interface User {
  display_name: string;
  images: { url: string }[];
}

const Home = ({ user }: { user: User }) => {
  return (
    <div>
      <SidebarOption user={user} />
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState<User | unknown>(null);

  console.log(user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        console.log(accessToken);

        if (!accessToken) {
          return;
        }

        const userData = await getUserDetails(accessToken);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="app">{user ? <Home user={user as User} /> : <Login />}</div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/home",
        element: <App />,
      },
    ],
  },
]);

const RootApp = () => {
  return <RouterProvider router={router} />;
};

export default RootApp;
