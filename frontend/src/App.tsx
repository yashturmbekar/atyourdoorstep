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
  // Content Management Pages
  AdminContentPage,
  AdminCategoriesPage,
  AdminHeroSlidesPage,
  AdminTestimonialsPage,
  AdminStatisticsPage,
  AdminSiteSettingsPage,
  AdminUspItemsPage,
  AdminCompanyStoryPage,
  AdminDeliverySettingsPage,
  AdminContactsPage,
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
        <Route path="analytics/sales" element={<AdminAnalyticsPage />} />
        <Route path="analytics/inventory" element={<AdminAnalyticsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="settings/payments" element={<AdminSettingsPage />} />
        <Route path="settings/notifications" element={<AdminSettingsPage />} />
        <Route path="settings/seo" element={<AdminSettingsPage />} />
        <Route path="settings/security" element={<AdminSettingsPage />} />

        {/* Content Management Routes */}
        <Route path="content" element={<AdminContentPage />} />
        <Route path="content/categories" element={<AdminCategoriesPage />} />
        <Route path="content/hero-slides" element={<AdminHeroSlidesPage />} />
        <Route
          path="content/testimonials"
          element={<AdminTestimonialsPage />}
        />
        <Route path="content/statistics" element={<AdminStatisticsPage />} />
        <Route
          path="content/site-settings"
          element={<AdminSiteSettingsPage />}
        />
        <Route path="content/usp-items" element={<AdminUspItemsPage />} />
        <Route
          path="content/company-story"
          element={<AdminCompanyStoryPage />}
        />
        <Route
          path="content/delivery"
          element={<AdminDeliverySettingsPage />}
        />
        <Route path="content/contacts" element={<AdminContactsPage />} />
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
