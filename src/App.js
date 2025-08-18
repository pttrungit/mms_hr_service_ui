import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./components/Auth/LoginForm";
import LeaveRequestList from "./components/LeaveRequest/LeaveRequestList";
import RequireAuth from "./components/Auth/RequireAuth";
import LeaveRequestForm from "./components/LeaveRequest/LeaveRequestForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route
          path="/leave-requests"
          element={
            <RequireAuth>
              <LeaveRequestList />
            </RequireAuth>
          }
        />
        <Route
          path="/leave-requests/create"
          element={
            <RequireAuth>
              <LeaveRequestForm />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
