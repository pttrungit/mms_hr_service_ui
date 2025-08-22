import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./components/Auth/LoginForm";
import LeaveRequestList from "./components/LeaveRequest/LeaveRequestList";
import RequireAuth from "./components/Auth/RequireAuth";
import LeaveRequestForm from "./components/LeaveRequest/LeaveRequestForm";
import Layout from "./components/Layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang Login, không có sidebar */}
        <Route path="/" element={<LoginForm />} />

        {/* Trang có sidebar */}
        <Route
          path="/leave-requests"
          element={
            <RequireAuth>
              <Layout>
                <LeaveRequestList />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/leave-requests/create"
          element={
            <RequireAuth>
              <Layout>
                <LeaveRequestForm />
              </Layout>
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
