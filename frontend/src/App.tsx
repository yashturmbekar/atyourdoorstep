import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { AdminLayout } from './components/admin';
import { ScrollToTop } from './components/common';
import {
  HomePage,
  OrderPage,
  ThemeDemoPage,
  AdminLoginPage,
  AdminDashboardPage,
  AdminProductsPage,
  AdminProductFormPage,
  AdminProductEditPage,
  AdminOrdersPage,
  AdminCustomersPage,
  AdminAnalyticsPage,
  AdminSettingsPage,
} from './pages';
import { useAdminAuth } from './hooks/useAdminAuth';
import './styles/globals.css';
import './styles/App.css';

// Protected Route component for admin routes
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.125rem',
          color: 'var(--color-text-light)',
        }}
      >
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Admin routes with layout
const AdminRoutes: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<AdminProductFormPage />} />
        <Route
          path="products/:productId/edit"
          element={<AdminProductEditPage />}
        />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Routes>
    </AdminLayout>
  );
};

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <AdminAuthProvider>
          <Router>
            <ScrollToTop />
            <div className="App theme-page-layout">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/order/:category" element={<OrderPage />} />
                <Route path="/theme-demo" element={<ThemeDemoPage />} />

                {/* Admin Login Route */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedAdminRoute>
                      <AdminRoutes />
                    </ProtectedAdminRoute>
                  }
                />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </AdminAuthProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
