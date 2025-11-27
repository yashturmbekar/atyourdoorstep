import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../../hooks';
import './Header.css';

interface HeaderProps {
  onCartClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              src="/images/AtYourDoorStep.png"
              alt="AtYourDoorStep Logo"
              className="logo-image"
            />
            <div className="logo-text">
              <span className="tagline">Quality You Can Trust, Delivered</span>
              <h2>AtYourDoorStep</h2>
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
