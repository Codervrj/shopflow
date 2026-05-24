import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartSidebar from './components/cart/CartSidebar';
import ToastContainer from './components/ui/Toast';
import AuthGuard from './components/guards/AuthGuard';
import AdminGuard from './components/guards/AdminGuard';
import AdminLayout from './components/layout/AdminLayout';
import ScrollToTopButton, { ScrollRestorer } from './components/ui/ScrollToTop';

import HomePage from './pages/storefront/HomePage';
import ProductListPage from './pages/storefront/ProductListPage';
import ProductDetailPage from './pages/storefront/ProductDetailPage';
import SearchPage from './pages/storefront/SearchPage';

import CartPage from './pages/checkout/CartPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import OrderConfirmationPage from './pages/checkout/OrderConfirmationPage';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

import OrderHistoryPage from './pages/account/OrderHistoryPage';
import SavedAddressesPage from './pages/account/SavedAddressesPage';

import DashboardPage from './pages/admin/DashboardPage';
import ProductsAdminPage from './pages/admin/ProductsAdminPage';
import OrdersAdminPage from './pages/admin/OrdersAdminPage';
import CustomersAdminPage from './pages/admin/CustomersAdminPage';

function StorefrontLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <CartSidebar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

function AuthLayout() {
  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollRestorer />
      <ToastContainer />
      <Routes>
        {/* Storefront */}
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
          <Route element={<AuthGuard />}>
            <Route path="/account/orders" element={<OrderHistoryPage />} />
            <Route path="/account/addresses" element={<SavedAddressesPage />} />
          </Route>
        </Route>

        {/* Auth — no header/footer */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Admin */}
        <Route element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin/products" element={<ProductsAdminPage />} />
            <Route path="/admin/orders" element={<OrdersAdminPage />} />
            <Route path="/admin/customers" element={<CustomersAdminPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
