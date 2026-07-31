import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import PublicRoute from "./components/auth/PublicRoute.jsx";

import Home from "./pages/Home.jsx";
import Signup from "./pages/auth/Signup.jsx";
import Login from "./pages/auth/Login.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";

import SearchResults from "./pages/SearchResults.jsx";
import Profile from "./pages/Profile.jsx";

import AdminLayout from "./pages/admin/layout/AdminLayout.jsx";

import Dashboard from "./pages/admin/Dashboard/Dashboard.jsx";
import Products from "./pages/admin/Products/Products.jsx";
import Users from "./pages/admin/Users/Users.jsx";
import Categories from "./pages/admin/Categories/Categories.jsx";
import Stores from "./pages/admin/Stores/Stores.jsx";
import Reviews from "./pages/admin/Reviews/Reviews.jsx";
import AIRecommendation from "./pages/admin/AIRecommendation/AIRecommendation.jsx";
import Analytics from "./pages/admin/Analytics/Analytics.jsx";
import Notifications from "./pages/admin/Notifications/Notifications.jsx";
import Settings from "./pages/admin/Settings/Settings.jsx";


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
        element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } 
      />

      <Route 
        path="/login" 
        element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
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
        path="/search-results"
        element={<SearchResults />}
      />

      <Route
        path="/profile"
        element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
      />

      <Route
        path="/wishlist"
        element={
            <ProtectedRoute>
              <Profile initialTab="wishlist" />
            </ProtectedRoute>
          }
      />

        <Route path="/admin" element={<AdminLayout />}>

          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />

          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          <Route
            path="products"
            element={<Products />}
          />

          <Route
            path="users"
            element={<Users />}
          />

          <Route
            path="categories"
            element={<Categories />}
          />

          <Route
            path="stores"
            element={<Stores />}
          />

          <Route
            path="reviews"
            element={<Reviews />}
          />

          <Route
            path="ai"
            element={<AIRecommendation />}
          />

          <Route
            path="analytics"
            element={<Analytics />}
          />

          <Route
            path="notifications"
            element={<Notifications />}
          />

          <Route
            path="settings"
            element={<Settings />}
          />

        </Route>
        
    </Routes>
    
    </BrowserRouter>
  );
}

export default App;