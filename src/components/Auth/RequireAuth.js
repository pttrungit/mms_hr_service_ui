import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("authToken");
  const location = useLocation();

  if (!token) {
    // Chưa đăng nhập → quay về trang login, nhớ vị trí cũ
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default RequireAuth;
