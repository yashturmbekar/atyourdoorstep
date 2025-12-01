import React, { useState, useMemo } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import type { IconType } from 'react-icons';
import {
  FiMenu,
  FiX,
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiBarChart,
  FiSettings,
  FiLogOut,
  FiChevronRight,
  FiBell,
  FiGrid,
  FiImage,
  FiMessageSquare,
  FiTrendingUp,
  FiInfo,
  FiTruck,
  FiMail,
  FiCreditCard,
  FiStar,
  FiFileText,
  FiGlobe,
  FiLayers,
  FiShield,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import { useAdminAuth } from '../../../hooks/useAdminAuth';
import { useAdminBadgeCounts } from '../../../hooks/admin';
import './AdminLayout.css';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: IconType;
  exact?: boolean;
  badge?: number;
}

interface NavigationSection {
  section: string;
  icon?: IconType;
  collapsible?: boolean;
  items: NavigationItem[];
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  );
  const location = useLocation();
  const { adminUser, logout } = useAdminAuth();

  // Fetch dynamic badge counts from API
  const { data: badgeCounts } = useAdminBadgeCounts();

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  // Navigation with dynamic badge counts
  const navigation: NavigationSection[] = useMemo(
    () => [
      {
        section: 'Main',
        items: [
          {
            name: 'Dashboard',
            href: '/admin',
            icon: FiHome,
            exact: true,
          },
        ],
      },
      {
        section: 'Products & Inventory',
        icon: FiPackage,
        collapsible: true,
        items: [
          {
            name: 'Products',
            href: '/admin/products',
            icon: FiPackage,
            badge: badgeCounts?.lowStockProducts || undefined,
          },
          {
            name: 'Product Categories',
            href: '/admin/product-categories',
            icon: FiGrid,
          },
        ],
      },
      {
        section: 'Orders & Customers',
        icon: FiShoppingCart,
        collapsible: true,
        items: [
          {
            name: 'Orders',
            href: '/admin/orders',
            icon: FiShoppingCart,
            badge: badgeCounts?.pendingOrders || undefined,
          },
          {
            name: 'Customers',
            href: '/admin/customers',
            icon: FiUsers,
          },
          {
            name: 'Contact Inquiries',
            href: '/admin/content/contacts',
            icon: FiMail,
            badge: badgeCounts?.unreadContacts || undefined,
          },
        ],
      },
      {
        section: 'Site Content',
        icon: FiFileText,
        collapsible: true,
        items: [
          {
            name: 'Content Dashboard',
            href: '/admin/content',
            icon: FiLayers,
          },
          {
            name: 'Hero Slides',
            href: '/admin/content/hero-slides',
            icon: FiImage,
          },
          {
            name: 'Testimonials',
            href: '/admin/content/testimonials',
            icon: FiMessageSquare,
          },
          {
            name: 'Statistics',
            href: '/admin/content/statistics',
            icon: FiTrendingUp,
          },
          {
            name: 'USP Items',
            href: '/admin/content/usp-items',
            icon: FiStar,
          },
          {
            name: 'Company Story',
            href: '/admin/content/company-story',
            icon: FiInfo,
          },
        ],
      },
      {
        section: 'Settings & Config',
        icon: FiSettings,
        collapsible: true,
        items: [
          {
            name: 'Site Settings',
            href: '/admin/content/site-settings',
            icon: FiGlobe,
          },
          {
            name: 'Delivery Settings',
            href: '/admin/content/delivery',
            icon: FiTruck,
          },
          {
            name: 'Payment Settings',
            href: '/admin/settings/payments',
            icon: FiCreditCard,
          },
          {
            name: 'Notifications',
            href: '/admin/settings/notifications',
            icon: FiBell,
          },
          {
            name: 'SEO & Social',
            href: '/admin/settings/seo',
            icon: FiGlobe,
          },
          {
            name: 'Security',
            href: '/admin/settings/security',
            icon: FiShield,
          },
          {
            name: 'General Settings',
            href: '/admin/settings',
            icon: FiSettings,
          },
        ],
      },
      {
        section: 'Analytics & Reports',
        icon: FiBarChart,
        collapsible: true,
        items: [
          {
            name: 'Dashboard Analytics',
            href: '/admin/analytics',
            icon: FiBarChart,
          },
          {
            name: 'Sales Reports',
            href: '/admin/analytics/sales',
            icon: FiTrendingUp,
          },
          {
            name: 'Inventory Reports',
            href: '/admin/analytics/inventory',
            icon: FiPackage,
          },
        ],
      },
    ],
    [badgeCounts]
  );

  const isActiveLink = (href: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === href;
    }
    // For non-exact matches, check if path matches exactly or is a direct child
    // This prevents /admin/content from matching /admin/content/categories
    if (location.pathname === href) {
      return true;
    }
    // Only match if it's a proper sub-path (has trailing slash context)
    return location.pathname.startsWith(href + '/');
  };

  const isSectionActive = (items: NavigationItem[]) => {
    return items.some(item => isActiveLink(item.href, item.exact));
  };

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Admin', href: '/admin' }];

    let currentPath = '/admin';
    for (let i = 1; i < pathSegments.length; i++) {
      currentPath += `/${pathSegments[i]}`;
      const segment = pathSegments[i];
      const name =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      breadcrumbs.push({ name, href: currentPath });
    }

    return breadcrumbs;
  };

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}
      >
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <img src="/images/AtYourDoorStep.png" alt="AtYourDoorStep" />
            {!sidebarCollapsed && <span>Admin Panel</span>}
          </div>
          {!sidebarCollapsed && (
            <button
              className="sidebar-toggle"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              {sidebarCollapsed ? <FiMenu /> : <FiX />}
            </button>
          )}
          {sidebarCollapsed && (
            <button
              className="sidebar-toggle-collapsed"
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
            >
              <FiMenu />
            </button>
          )}
        </div>

        <nav className="admin-nav">
          {navigation.map(section => {
            const isCollapsed = collapsedSections.has(section.section);
            const hasActiveItem = isSectionActive(section.items);

            return (
              <div key={section.section} className="nav-section">
                {section.collapsible ? (
                  <button
                    className={`nav-section-header ${hasActiveItem ? 'active' : ''}`}
                    onClick={() => toggleSection(section.section)}
                    title={section.section}
                  >
                    {section.icon && (
                      <section.icon className="nav-section-icon" />
                    )}
                    <span className="nav-section-title">{section.section}</span>
                    <span className="nav-section-toggle">
                      {isCollapsed ? <FiChevronDown /> : <FiChevronUp />}
                    </span>
                  </button>
                ) : (
                  <div className="nav-section-title">{section.section}</div>
                )}
                {(!section.collapsible || !isCollapsed) && (
                  <div className="nav-section-items">
                    {section.items.map(item => {
                      const isActive = isActiveLink(item.href, item.exact);

                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`nav-item ${isActive ? 'active' : ''}`}
                          onClick={() => setMobileMenuOpen(false)}
                          title={item.name}
                        >
                          <item.icon className="nav-item-icon" />
                          <span className="nav-item-text">{item.name}</span>
                          {item.badge && (
                            <span className="notification-badge">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          {adminUser && (
            <div className="admin-user-info">
              <div className="user-avatar">
                {adminUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <div className="user-name">{adminUser.name}</div>
                <div className="user-role">
                  {adminUser.role.replace('_', ' ')}
                </div>
              </div>
            </div>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
      >
        <header className="admin-header">
          <div className="admin-header-top">
            <div className="admin-header-left">
              <div className="header-brand">
                <div className="header-logo-container">
                  <img
                    src="/images/AtYourDoorStep.png"
                    alt="AtYourDoorStep"
                    className="header-logo-image"
                  />
                  <div className="header-logo-pulse"></div>
                </div>
                <div className="header-brand-text">
                  <span className="header-brand-name">AtYourDoorStep</span>
                </div>
              </div>
            </div>

            <div className="admin-header-actions">
              <button
                className="sidebar-toggle md:hidden"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                <FiMenu />
              </button>
              <button className="sidebar-toggle" aria-label="Notifications">
                <FiBell />
              </button>
            </div>
          </div>

          <div className="admin-breadcrumb">
            {getBreadcrumbs().map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                {index > 0 && (
                  <FiChevronRight className="breadcrumb-separator" />
                )}
                <Link
                  to={crumb.href}
                  className={`breadcrumb-item ${index === getBreadcrumbs().length - 1 ? 'active' : ''}`}
                >
                  {crumb.name}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </header>

        <div className="admin-content">{children || <Outlet />}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
