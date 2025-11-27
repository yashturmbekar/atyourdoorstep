import { useState } from 'react';
import './Contact.css';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const validateForm = () => {
    const newErrors: typeof errors = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    };

    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format.';
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits.';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required.';
    if (!formData.message.trim()) newErrors.message = 'Message is required.';

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setErrors(prev => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      alert("Thank you for your message! We'll get back to you soon.");
    }
  };

  return (
    <section id="contact" className="contact section">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-label">Get In Touch</span>
          <h2>Contact Us</h2>
          <p className="section-description">
            Ready to experience the finest natural products? We'd love to hear
            from you.
          </p>
        </div>

        <div className="contact-wrapper">
          <div className="contact-cards">
            <div className="contact-card">
              <div className="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21C10.4 21 2 12.6 2 2.08C2 1.48 2.48 1 3.08 1H6.08C6.68 1 7.16 1.48 7.16 2.08V5.5C7.16 6.1 6.68 6.58 6.08 6.58H4.5C5.5 10.5 8.5 13.5 12.5 14.5V12.92C12.5 12.32 12.98 11.84 13.58 11.84H17C17.6 11.84 18.08 12.32 18.08 12.92V15.92C18.08 16.52 17.6 17 17 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Call Us</h3>
              <p>+91-8237381312</p>
              <span>Mon-Sat, 9AM-7PM</span>
            </div>

            <div className="contact-card">
              <div className="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
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
              </div>
              <h3>Email Us</h3>
              <p>yashturmbekar7@gmail.com</p>
              <span>We'll respond within 24 hours</span>
            </div>

            <div className="contact-card">
              <div className="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
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
              </div>
              <h3>Visit Us</h3>
              <p>Pune, Maharashtra, India</p>
              <span>Farm fresh products direct to you</span>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <div className="form-header">
              <h3>Send us a Message</h3>
              <p>
                Have questions about our products or want to place an order?
                We're here to help!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                  />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                  />
                  {errors.phone && <span className="error">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Inquiry Type</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select inquiry type</option>
                    <option value="product">Product Information</option>
                    <option value="order">Place an Order</option>
                    <option value="bulk">Bulk Orders</option>
                    <option value="corporate">Corporate Gifts</option>
                    <option value="seasonal">Seasonal Offers</option>
                    <option value="delivery">Delivery Questions</option>
                    <option value="support">Customer Support</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.subject && <span className="error">{errors.subject}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us about your requirements, questions, or how we can help you..."
                />
                {errors.message && <span className="error">{errors.message}</span>}
              </div>

              <button type="submit" className="submit-btn">
                <span>Send Message</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 2L11 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 2L15 22L11 13L2 9L22 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
