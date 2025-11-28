/**
 * Header Component - Dynamic Content from ContentService
 * Displays site branding and navigation with data from CMS
 */
import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../../hooks';
import { useSiteInfo } from '../../../hooks/useContent';
import './Header.css';

interface HeaderProps {
  onCartClick?: () => void;
}

// Fallback site info when API is not available
const FALLBACK_SITE_INFO = {
  name: 'AtYourDoorStep',
  tagline: 'Quality You Can Trust, Delivered',
  logoUrl: '/images/AtYourDoorStep.png',
};

export const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch dynamic content from ContentService
  const { data: siteInfoResponse, isLoading } = useSiteInfo();

  // Transform API data to component format
  const siteInfo = useMemo(() => {
    if (siteInfoResponse?.data) {
      const data = siteInfoResponse.data;
      return {
        name: data.companyName || FALLBACK_SITE_INFO.name,
        tagline: data.tagLine || FALLBACK_SITE_INFO.tagline,
        logoUrl: data.logo || FALLBACK_SITE_INFO.logoUrl,
      };
    }
    return FALLBACK_SITE_INFO;
  }, [siteInfoResponse]);

  const cartItemCount = getCartItemCount();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    // Check if we're on the home page
    if (location.pathname === '/') {
      // We're on home page, just scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // We're on a different page, navigate to home page with hash
      navigate(`/#${sectionId}`);
    }
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      // If on home page, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If on different page, navigate to home
      navigate('/');
    }
  };

  return (
    <header className="header">
      <div className="container">
        {' '}
        <div className="header-content">
          <div
            className="logo"
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={siteInfo.logoUrl}
              alt={`${siteInfo.name} Logo`}
              className="logo-image"
              onError={e => {
                e.currentTarget.src = '/images/placeholder.png';
              }}
            />
            <div className="logo-text">
              <span className="tagline">
                {isLoading ? '...' : siteInfo.tagline}
              </span>
              <h2>{isLoading ? '...' : siteInfo.name}</h2>
            </div>
          </div>
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <a href="#home" onClick={() => scrollToSection('home')}>
              Home
            </a>
            <a href="#about" onClick={() => scrollToSection('about')}>
              About Us
            </a>
            <a href="#products" onClick={() => scrollToSection('products')}>
              Products
            </a>
            <a
              href="#why-choose-us"
              onClick={() => scrollToSection('why-choose-us')}
            >
              Why Choose Us
            </a>
            <a
              href="#testimonials"
              onClick={() => scrollToSection('testimonials')}
            >
              Testimonials
            </a>
            <a href="#contact" onClick={() => scrollToSection('contact')}>
              Contact
            </a>
          </nav>
          <div className="header-actions">
            {/* Cart Button */}
            <button
              className={`cart-button ${cartItemCount > 0 ? 'has-items' : ''}`}
              onClick={onCartClick}
              aria-label="View Cart"
            >
              🛒
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </button>

            <button
              className="btn btn-primary"
              onClick={() => scrollToSection('products')}
            >
              Order Now
            </button>
            <button
              className={`menu-toggle ${isMenuOpen ? 'menu-toggle-open' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
