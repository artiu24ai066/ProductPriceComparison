import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Signup from "./pages/auth/Signup.jsx";
import Login from "./pages/auth/Login.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";

import SearchResults from "./pages/SearchResults.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route 
        path="/" 
        element={<Home />} 
      />

      <Route 
        path="/signup" 
        element={<Signup />} 
      />

      <Route 
        path="/login" 
        element={<Login />} 
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

      <Route
        path="/search-results/:token"
        element={<SearchResults />}
      />

      <Route
        path="/profile"
        element={<Profile />}
      />
    </Routes>
    
    </BrowserRouter>
  );
}

export default App;