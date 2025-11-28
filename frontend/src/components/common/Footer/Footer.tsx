/**
 * Footer Component - Dynamic Content from ContentService
 * Displays site info, social links, contact info, and product links from CMS
 */
import { useMemo } from 'react';
import { useSiteInfo, useActiveCategories } from '../../../hooks/useContent';
import './Footer.css';

// Social media icons as React components
const SocialIcons = {
  facebook: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  twitter: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12393C16.6767 2.90116 15.7395 2.95718 14.8821 3.28445C14.0247 3.61173 13.2884 4.19445 12.773 4.95371C12.2575 5.71297 11.9877 6.61234 12 7.53V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39624C5.36074 6.60667 4.01032 5.43666 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.5C20.9991 7.22145 20.9723 6.94359 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3V3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  instagram: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        ry="5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61992 14.1902 8.22773 13.4229 8.09407 12.5922C7.9604 11.7615 8.09207 10.9099 8.47033 10.1584C8.84859 9.40685 9.45418 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87658 12.63 8C13.4789 8.12588 14.2649 8.52146 14.8717 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M17.5 6.5H17.51"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  linkedin: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 8C18.5 8 20.5 10 20.5 12.5V21H17V12.5C17 11.5 16 10.5 15 10.5S13 11.5 13 12.5V21H9.5V8H13V9.5C13.5 8.5 14.5 8 16 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="2"
        y="9"
        width="4"
        height="12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="4"
        cy="4"
        r="2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  youtube: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.54 6.42C22.4212 5.94541 22.1793 5.51057 21.8387 5.15941C21.498 4.80824 21.0708 4.55318 20.6 4.42C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92925 4.59318 2.50198 4.84824 2.16135 5.19941C1.82072 5.55057 1.57879 5.98541 1.46 6.46C1.14521 8.20556 0.991235 9.97631 1 11.75C0.988687 13.537 1.14266 15.3213 1.46 17.08C1.59096 17.5398 1.83831 17.9581 2.17817 18.2945C2.51803 18.6308 2.93882 18.8738 3.4 19C5.12 19.46 12 19.46 12 19.46C12 19.46 18.88 19.46 20.6 19C21.0708 18.8668 21.498 18.6118 21.8387 18.2606C22.1793 17.9094 22.4212 17.4746 22.54 17C22.8524 15.2676 23.0063 13.5103 23 11.75C23.0113 9.96295 22.8573 8.1787 22.54 6.42Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 15.02L15.5 11.75L9.75 8.48V15.02Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  whatsapp: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// Fallback site info when API is not available
const FALLBACK_SITE_INFO = {
  name: 'AtYourDoorStep',
  tagline: 'Quality You Can Trust, Delivered',
  description:
    'Bringing you the organic jaggery, pure all types of cold-pressed oils and finest Ratnagiri Alphonso mangoes directly from the source to your doorstep.',
  logoUrl: '/images/AtYourDoorStep.png',
  phone: '+91-8237381312',
  email: 'yashturmbekar7@gmail.com',
  address: 'Pune, Maharashtra, India',
  socialLinks: [
    {
      platform: 'facebook',
      url: 'https://www.facebook.com/profile.php?id=100074808451374',
    },
    { platform: 'twitter', url: 'https://x.com/goprobaba' },
    { platform: 'instagram', url: 'https://www.instagram.com/gopro.baba/' },
    { platform: 'linkedin', url: 'https://www.linkedin.com/in/yashturmbekar' },
  ],
};

// Fallback products when API is not available
const FALLBACK_PRODUCTS = [
  { id: 'alphonso', name: 'Ratnagiri Alphonso Mangoes' },
  { id: 'oil', name: 'Cold-Pressed Oils' },
  { id: 'jaggery', name: 'Organic Jaggery' },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Fetch dynamic content from ContentService
  const { data: siteInfoResponse, isLoading: siteInfoLoading } = useSiteInfo();
  const { data: categoriesResponse } = useActiveCategories();

  // Transform API data to component format
  const siteInfo = useMemo(() => {
    if (siteInfoResponse?.data) {
      const data = siteInfoResponse.data;
      // Transform socialLinks from Record<string, string> to array format
      const transformedSocialLinks = data.socialLinks
        ? Object.entries(data.socialLinks).map(([platform, url]) => ({
            platform,
            url,
          }))
        : FALLBACK_SITE_INFO.socialLinks;
      return {
        name: data.companyName || FALLBACK_SITE_INFO.name,
        tagline: data.tagLine || FALLBACK_SITE_INFO.tagline,
        description: FALLBACK_SITE_INFO.description, // Not in API, use fallback
        logoUrl: data.logo || FALLBACK_SITE_INFO.logoUrl,
        phone: data.phone || FALLBACK_SITE_INFO.phone,
        email: data.email || FALLBACK_SITE_INFO.email,
        address: data.address || FALLBACK_SITE_INFO.address,
        socialLinks:
          transformedSocialLinks.length > 0
            ? transformedSocialLinks
            : FALLBACK_SITE_INFO.socialLinks,
      };
    }
    return FALLBACK_SITE_INFO;
  }, [siteInfoResponse]);

  const products = useMemo(() => {
    if (categoriesResponse?.data && categoriesResponse.data.length > 0) {
      return categoriesResponse.data.slice(0, 5).map(category => ({
        id: category.slug || category.id,
        name: category.name,
      }));
    }
    return FALLBACK_PRODUCTS;
  }, [categoriesResponse]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to get social icon by platform
  const getSocialIcon = (platform: string) => {
    const normalizedPlatform = platform.toLowerCase();
    return (
      SocialIcons[normalizedPlatform as keyof typeof SocialIcons] ||
      SocialIcons.facebook
    );
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            {' '}
            <div className="footer-brand">
              <div className="logo">
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
                    {siteInfoLoading ? '...' : siteInfo.tagline}
                  </span>
                  <h3>{siteInfoLoading ? '...' : siteInfo.name}</h3>
                </div>
              </div>
              <p>{siteInfoLoading ? 'Loading...' : siteInfo.description}</p>{' '}
              <div className="social-links">
                {siteInfo.socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="social-link"
                    aria-label={social.platform}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
              </div>
            </div>{' '}
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a href="#home" onClick={() => scrollToSection('home')}>
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" onClick={() => scrollToSection('about')}>
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#products"
                    onClick={() => scrollToSection('products')}
                  >
                    Products
                  </a>
                </li>
                <li>
                  <a
                    href="#why-choose-us"
                    onClick={() => scrollToSection('why-choose-us')}
                  >
                    Why Choose Us
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    onClick={() => scrollToSection('testimonials')}
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#contact" onClick={() => scrollToSection('contact')}>
                    Contact
                  </a>
                </li>
              </ul>
            </div>{' '}
            <div className="footer-links">
              <h4>Our Products</h4>
              <ul>
                {products.map(product => (
                  <li key={product.id}>
                    <a href="#products">{product.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-links">
              <h4>Business Services</h4>
              <ul>
                <li>
                  <a href="#contact">Bulk Orders</a>
                </li>
                <li>
                  <a href="#contact">Seasonal Offers</a>
                </li>
                <li>
                  <a href="#contact">Corporate Gifts</a>
                </li>
              </ul>
            </div>{' '}
            <div className="footer-links">
              <h4>Support</h4>
              <ul>
                <li>
                  <a href="#contact">Contact Us</a>
                </li>
                <li>
                  <a href="#contact">Track Your Order</a>
                </li>
                <li>
                  <a href="#contact">FAQ</a>
                </li>
                <li>
                  <a href="#contact">Shipping Info</a>
                </li>
                <li>
                  <a href="#contact">Delivery Schedule</a>
                </li>
                <li>
                  <a href="#contact">Bulk Orders</a>
                </li>
              </ul>
            </div>
            <div className="footer-contact">
              <h4>Contact Info</h4>
              <div className="contact-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.03 7.03 1 12 1S21 5.03 21 10Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="10"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span>{siteInfoLoading ? '...' : siteInfo.address}</span>
              </div>
              <div className="contact-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21C10.4 21 2 12.6 2 2.08C2 1.48 2.48 1 3.08 1H6.08C6.68 1 7.16 1.48 7.16 2.08V5.5C7.16 6.1 6.68 6.58 6.08 6.58H4.5C5.5 10.5 8.5 13.5 12.5 14.5V12.92C12.5 12.32 12.98 11.84 13.58 11.84H17C17.6 11.84 18.08 12.32 18.08 12.92V15.92C18.08 16.52 17.6 17 17 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{siteInfoLoading ? '...' : siteInfo.phone}</span>
              </div>
              <div className="contact-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="22,6 12,13 2,6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{siteInfoLoading ? '...' : siteInfo.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>
                &copy; {currentYear} {siteInfo.name}. All rights reserved.
              </p>
            </div>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
            <button
              className="back-to-top"
              onClick={scrollToTop}
              aria-label="Back to top"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 15L12 9L6 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
