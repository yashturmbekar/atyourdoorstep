import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiLock,
  FiShield,
} from 'react-icons/fi';
import { useAdminAuth } from '../../../hooks/useAdminAuth';
import './AdminLogin.css';

/**
 * Secure Admin Login Component
 * Features:
 * - Input validation with detailed feedback
 * - Rate limiting protection (handled by authService)
 * - Secure password field with visibility toggle
 * - CSRF protection via SameSite cookies
 * - Clear error messaging
 */
const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    login,
    isLoading,
    isAuthenticated,
    error: authError,
    clearError,
  } = useAdminAuth();
  const navigate = useNavigate();

  // Clear auth errors when component mounts or when user starts typing
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Show loading state while checking initial auth status
  if (isLoading) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <div className="success-animation">
            <div className="success-loader"></div>
            <p className="success-message">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if already authenticated (only after loading is complete)
  // Don't redirect if we're showing success animation (we'll navigate programmatically)
  if (isAuthenticated && !isSuccess) {
    return <Navigate to="/admin" replace />;
  }

  /**
   * Validates form inputs with detailed error messages
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission with security measures
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    clearError();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await login(
        formData.email.toLowerCase().trim(),
        formData.password
      );

      if (success) {
        setIsSuccess(true);
        // Clear password from memory
        setFormData(prev => ({ ...prev, password: '' }));

        // Navigate to admin dashboard after showing success animation
        setTimeout(() => {
          navigate('/admin', { replace: true });
        }, 800);
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsSubmitting(false);
    }
  };

  /**
   * Handles input changes with error clearing
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear specific field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear auth error when user modifies form
    if (authError) {
      clearError();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Fills demo credentials for testing
   * Note: In production, this should be removed
   */
  const fillDemoCredentials = () => {
    setFormData({
      email: 'admin@atyourdoorstep.com',
      password: 'Admin@123!',
    });
    setFieldErrors({});
    clearError();
  };

  return (
    <div className="admin-login">
      <div className={`login-container ${isSuccess ? 'success' : ''}`}>
        {isSuccess ? (
          <div className="success-animation">
            <div className="success-icon">✓</div>
            <h2 className="success-title">Welcome to AtYourDoorStep!</h2>
            <p className="success-message">Redirecting to your dashboard...</p>
            <div className="success-loader"></div>
          </div>
        ) : (
          <>
            <div className="login-header">
              <div className="login-logo">
                <img src="/images/AtYourDoorStep.png" alt="AtYourDoorStep" />
                <div className="brand-text">
                  <h1 className="login-title">AtYourDoorStep</h1>
                  <p className="brand-tagline">Premium Natural Products</p>
                </div>
              </div>
              <p className="login-subtitle">
                <FiShield
                  style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}
                />
                Secure Admin Portal
              </p>
            </div>

            {/* Display authentication errors from context */}
            {authError && (
              <div className="login-error" role="alert">
                <FiAlertCircle />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                  autoComplete="email"
                  autoFocus
                  aria-describedby={
                    fieldErrors.email ? 'email-error' : undefined
                  }
                  aria-invalid={!!fieldErrors.email}
                />
                {fieldErrors.email && (
                  <div id="email-error" className="input-error" role="alert">
                    {fieldErrors.email}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <FiLock
                    style={{ marginRight: '0.25rem', verticalAlign: 'middle' }}
                  />
                  Password
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                    disabled={isSubmitting}
                    autoComplete="current-password"
                    style={{ paddingRight: '3.5rem' }}
                    aria-describedby={
                      fieldErrors.password ? 'password-error' : undefined
                    }
                    aria-invalid={!!fieldErrors.password}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="password-toggle"
                    disabled={isSubmitting}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <div id="password-error" className="input-error" role="alert">
                    {fieldErrors.password}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner" aria-hidden="true" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <FiLock style={{ marginRight: '0.5rem' }} />
                    <span>Sign In Securely</span>
                  </>
                )}
              </button>
            </form>

            <div className="demo-credentials">
              <p className="demo-text">
                Demo: admin@atyourdoorstep.com / Admin@123!
              </p>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="demo-fill-button"
                disabled={isSubmitting}
              >
                Fill Demo
              </button>
            </div>

            <div className="security-notice">
              <FiShield size={14} />
              <span>Protected by secure authentication</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
