import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Auth } from "./pages/auth/Auth";
import { Profile } from "./pages/profile/Profile";
import { Chat } from "./pages/chat/Chat";
import { useAppStore } from "./store/store";
import { useEffect, useState } from "react";
import { apiClient } from "./lib/api-client";
import { GET_USER_ROUTE } from "./utils/constants";
const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" replace={true} />;
};
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" replace={true} /> : children;
};
const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await apiClient.get(GET_USER_ROUTE, {
          withCredentials: true,
        });
        if (res.status === 200 && res.data.user) {
          setUserInfo(res.data.user);
        } else {
          setUserInfo(undefined);
        }
      } catch (err) {
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };
    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="h-16 w-16 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
