import { Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/signup" element={<Signup />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />
    </Routes>
  );
}

export default App;