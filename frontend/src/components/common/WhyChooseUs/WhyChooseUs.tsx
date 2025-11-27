import './WhyChooseUs.css';
import {
  FaSeedling,
  FaIndustry,
  FaTruck,
  FaAppleAlt,
  FaCheckCircle,
  FaHeart,
} from 'react-icons/fa';

export const WhyChooseUs = () => {
  const reasons = [
    {
      icon: <FaSeedling size={32} />,
      title: 'Premium Organic Products',
      description:
        "Certified organic mangoes, cold-pressed oils, and traditional organic kolhapuri jaggery. Zero chemicals, zero compromise - just nature's purest goodness.",
    },
    {
      icon: <FaIndustry size={32} />,
      title: 'Vertically Integrated Operations',
      description:
        'We own our orchards, processing facilities, and distribution network. Complete control ensures consistent quality and freshness.',
    },
    {
      icon: <FaTruck size={32} />,
      title: 'Nationwide Express Delivery',
      description:
        'Fast and reliable delivery service with careful packaging ensures your fresh organic products reach you safely anywhere in India.',
    },
    {
      icon: <FaAppleAlt size={32} />,
      title: 'Harvest-to-Home Promise',
      description:
        "Our mangoes are picked fresh and sent directly to you. They ripen naturally in front of you - no artificial ripening, just nature's perfect timing.",
    },
    {
      icon: <FaCheckCircle size={32} />,
      title: '100% Satisfaction Guarantee',
      description:
        'Not happy with your order? We offer hassle-free returns and full refunds. Your satisfaction is our top priority.',
    },
    {
      icon: <FaHeart size={32} />,
      title: 'Generational Farming Wisdom',
      description:
        'Three generations of sustainable farming practices and traditional processing methods create products with authentic taste and nutrition.',
    },
  ];

  return (
    <section id="why-choose-us" className="why-choose-us section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Why Choose Us</span>
          <h2>Experience the AtYourDoorStep Difference</h2>
          <p className="section-description">
            Discover what sets us apart in delivering the finest natural
            products with integrity, tradition, and care.
          </p>
        </div>

        <div className="reasons-grid">
          {reasons.map((reason, index) => (
            <div key={index} className="reason-card">
              <div className="reason-icon">{reason.icon}</div>
              <h3 className="reason-title">{reason.title}</h3>
              <p className="reason-description">{reason.description}</p>
            </div>
          ))}
        </div>

        <div className="why-choose-stats">
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Pure & Natural</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">Direct</div>
            <div className="stat-label">From Source</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">Pan-India</div>
            <div className="stat-label">Delivery</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">3+</div>
            <div className="stat-label">Years Experience</div>
          </div>
        </div>
      </div>
    </section>
  );
};
