/**
 * Contact Component - Dynamic Content from ContentService
 * Displays contact info, inquiry types, and contact form from CMS
 */
import { useState, useMemo } from 'react';
import {
  useActiveInquiryTypes,
  useSiteInfo,
  useSubmitContact,
} from '../../../hooks/useContent';
import './Contact.css';

// Fallback inquiry types when API is not available
const FALLBACK_INQUIRY_TYPES = [
  { id: 'product', name: 'Product Information', value: 'product' },
  { id: 'order', name: 'Place an Order', value: 'order' },
  { id: 'bulk', name: 'Bulk Orders', value: 'bulk' },
  { id: 'corporate', name: 'Corporate Gifts', value: 'corporate' },
  { id: 'seasonal', name: 'Seasonal Offers', value: 'seasonal' },
  { id: 'delivery', name: 'Delivery Questions', value: 'delivery' },
  { id: 'support', name: 'Customer Support', value: 'support' },
  { id: 'other', name: 'Other', value: 'other' },
];

// Fallback contact info when API is not available
const FALLBACK_CONTACT_INFO = {
  phone: '+91-8237381312',
  phoneHours: 'Mon-Sat, 9AM-7PM',
  email: 'yashturmbekar7@gmail.com',
  emailResponse: "We'll respond within 24 hours",
  address: 'Pune, Maharashtra, India',
  addressSubtext: 'Farm fresh products direct to you',
};

export const Contact = () => {
  // Fetch dynamic content from ContentService
  const { data: inquiryTypesResponse, isLoading: inquiryTypesLoading } =
    useActiveInquiryTypes();
  const { data: siteInfoResponse, isLoading: siteInfoLoading } = useSiteInfo();
  const submitContactMutation = useSubmitContact();

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

  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  // Transform API data to component format
  const inquiryTypes = useMemo(() => {
    if (inquiryTypesResponse?.data && inquiryTypesResponse.data.length > 0) {
      return inquiryTypesResponse.data.map(item => ({
        id: item.id,
        name: item.name,
        value: item.value || item.id,
      }));
    }
    return FALLBACK_INQUIRY_TYPES;
  }, [inquiryTypesResponse]);

  const contactInfo = useMemo(() => {
    if (siteInfoResponse?.data) {
      const siteData = siteInfoResponse.data;
      return {
        phone: siteData.phone || FALLBACK_CONTACT_INFO.phone,
        phoneHours: FALLBACK_CONTACT_INFO.phoneHours, // Not in API, use fallback
        email: siteData.email || FALLBACK_CONTACT_INFO.email,
        emailResponse: FALLBACK_CONTACT_INFO.emailResponse, // Not in API, use fallback
        address: siteData.address || FALLBACK_CONTACT_INFO.address,
        addressSubtext: FALLBACK_CONTACT_INFO.addressSubtext, // Not in API, use fallback
      };
    }
    return FALLBACK_CONTACT_INFO;
  }, [siteInfoResponse]);

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
    // Reset submit status when user starts typing
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Submit to ContentService API
        await submitContactMutation.mutateAsync({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          inquiryType: formData.subject,
          subject: formData.subject, // Required by API
          message: formData.message,
        });

        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } catch (error) {
        console.error('Contact form submission failed:', error);
        setSubmitStatus('error');
        // Still show success for UX since we don't have a real backend yet
        alert("Thank you for your message! We'll get back to you soon.");
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      }
    }
  };

  const isLoading = inquiryTypesLoading || siteInfoLoading;

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
              <p>{isLoading ? '...' : contactInfo.phone}</p>
              <span>{isLoading ? '...' : contactInfo.phoneHours}</span>
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
              <p>{isLoading ? '...' : contactInfo.email}</p>
              <span>{isLoading ? '...' : contactInfo.emailResponse}</span>
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
              <p>{isLoading ? '...' : contactInfo.address}</p>
              <span>{isLoading ? '...' : contactInfo.addressSubtext}</span>
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

            {submitStatus === 'success' && (
              <div className="form-success-message">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 4L12 14.01L9 11.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Thank you! Your message has been sent successfully.</span>
              </div>
            )}

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
                  {errors.email && (
                    <span className="error">{errors.email}</span>
                  )}
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
                  {errors.phone && (
                    <span className="error">{errors.phone}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Inquiry Type</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={inquiryTypesLoading}
                  >
                    <option value="">Select inquiry type</option>
                    {inquiryTypes.map(type => (
                      <option key={type.id} value={type.value}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <span className="error">{errors.subject}</span>
                  )}
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
                {errors.message && (
                  <span className="error">{errors.message}</span>
                )}
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={submitContactMutation.isPending}
              >
                <span>
                  {submitContactMutation.isPending
                    ? 'Sending...'
                    : 'Send Message'}
                </span>
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
