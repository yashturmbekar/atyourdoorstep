import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { useAdminAuth } from '../../../hooks/useAdminAuth';
import './AdminLogin.css';

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginError, setLoginError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { login, isLoading, isAuthenticated } = useAdminAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!validateForm()) {
      return;
    }

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        setIsSuccess(true);
        // Add a small delay to show success animation before redirect
        setTimeout(() => {
          // The redirect will happen automatically via the Navigate component
        }, 800);
      } else {
        setLoginError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      setLoginError('An error occurred during login. Please try again.');
      console.error('Login error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear login error when user modifies form
    if (loginError) {
      setLoginError('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: 'admin@atyourdoorstep.com',
      password: 'admin123',
    });
    setErrors({});
    setLoginError('');
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
              <p className="login-subtitle">Admin Portal - Manage Your Store</p>
            </div>

            {loginError && (
              <div className="login-error">
                <FiAlertCircle />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
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
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                {errors.email && (
                  <div className="input-error">{errors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    style={{ paddingRight: '3.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="password-toggle"
                    disabled={isLoading}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="input-error">{errors.password}</div>
                )}
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="spinner" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            <div className="demo-credentials">
              <p className="demo-text">
                Demo: admin@atyourdoorstep.com / admin123
              </p>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="demo-fill-button"
                disabled={isLoading}
              >
                Fill Demo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
