import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MultiRestaurantPage from './pages/RestaurantDetail'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import { Route, Routes } from 'react-router-dom'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import RestaurantGridPage from './pages/Restaurents'
import CartPage from './pages/CartPage'
import UserDashboard from './pages/dashboard/UserDashboard'
import Profile from './pages/dashboard/section/Profile'
import Orders from './pages/dashboard/section/Order'
import Addresses from './pages/dashboard/section/Address'
import ChangePassword from './pages/dashboard/section/ChangePassword'
import AdminDashboard from './pages/admin/router/AdminRoutes'
import Dashboard from './pages/admin/Dashboard'
import Users from './pages/admin/User'
import Vendor from './pages/admin/Vendor'
import AdminOrdersPage from './pages/admin/Order'
import Categories from './pages/admin/Categories'
import Foods from './pages/admin/Food'
import Restaurants from './pages/admin/Restaurent'
import Settings from './pages/admin/Setting'
import VendorDashboard from './pages/vendor/routes/VendorRoute'
import VendorDashboards from './pages/vendor/Dashboard'
import VendorOrdersPage from './pages/vendor/Order'
import VendorCategories from './pages/vendor/Categories'
import VendorFoods from './pages/vendor/Food'
import VendorRestaurants from './pages/vendor/Restaurent'
import VendorProfile from './pages/vendor/Profile'
import VendorChangePassword from './pages/vendor/ChangePassword'
import OTPVerifyPage from './pages/OTPVerifyPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import CheckoutPage from './pages/CheckoutPage'
import Wishlist from './pages/dashboard/section/Wishlist'
import ProtectedRoute from './pages/ProtectedRoute'
import { useSelector } from 'react-redux'
import SearchPage from './pages/Search'

function App() {
  const { userData } = useSelector((state) => state.user);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/search' element={<SearchPage />} />
        <Route path="/login" element={userData ? <HomePage /> : <LoginPage />} />
        <Route path="/signup" element={userData ? <HomePage /> : <SignupPage />} />
        <Route path="/verify-otp" element={userData ? <HomePage /> : <OTPVerifyPage />} />
        <Route path="/restaurants" element={<RestaurantGridPage />} />
        <Route path="/restaurant/:id" element={<MultiRestaurantPage />} />
        <Route path="/forgot-password" element={userData ? <HomePage /> : <ForgotPasswordPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={userData ? <CheckoutPage /> : <LoginPage />} />
        <Route path="/order-success" element={userData ? <OrderSuccessPage /> : <LoginPage />} />

        {/* user  route here */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/dashboard" element={<UserDashboard />}>
            <Route index element={<Profile />} />
            <Route path="orders" element={<Orders />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Route>

        {/* admin route here */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="vendors" element={<Vendor />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="categories" element={<Categories />} />
            <Route path="foods" element={<Foods />} />
            <Route path="resturents" element={<Restaurants />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* ✅ VENDOR ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["vendor"]} />}>
          <Route path="/vendor/dashboard" element={<VendorDashboard />}>
            <Route index element={<VendorDashboards />} />
            <Route path="orders" element={<VendorOrdersPage />} />
            <Route path="categories" element={<VendorCategories />} />
            <Route path="foods" element={<VendorFoods />} />
            <Route path="resturents" element={<VendorRestaurants />} />
            <Route path="profile" element={<VendorProfile />} />
            <Route path="change-password" element={<VendorChangePassword />} />
          </Route>
        </Route>
      </Routes>
      <Footer />
    </div>
  )
}

export default App
