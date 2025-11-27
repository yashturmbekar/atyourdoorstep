import React, { useState, useEffect } from 'react';
import {
  FiSettings,
  FiUser,
  FiLock,
  FiMail,
  FiDatabase,
  FiShield,
  FiCreditCard,
  FiTruck,
  FiSave,
  FiRefreshCw,
  FiTrash2,
  FiUpload,
  FiDownload,
  FiToggleLeft,
  FiToggleRight,
} from 'react-icons/fi';
import './Settings.css';

interface SettingsData {
  profile: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  general: {
    siteName: string;
    siteDescription: string;
    currency: string;
    timezone: string;
    language: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    orderAlerts: boolean;
    stockAlerts: boolean;
    systemAlerts: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordPolicy: string;
    ipWhitelist: string[];
  };
  payment: {
    enableCOD: boolean;
    enableOnline: boolean;
    enableUPI: boolean;
    enableCards: boolean;
    processingFee: number;
  };
  shipping: {
    defaultShippingCost: number;
    freeShippingThreshold: number;
    maxDeliveryDays: number;
    enableExpressDelivery: boolean;
    expressDeliveryFee: number;
  };
  system: {
    maintenanceMode: boolean;
    debugMode: boolean;
    cacheEnabled: boolean;
    autoBackup: boolean;
    backupFrequency: string;
  };
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState<SettingsData>({
    profile: {
      name: 'Admin User',
      email: 'admin@atyourdoorstep.com',
      phone: '+91 98765 43210',
      role: 'Super Admin',
    },
    general: {
      siteName: 'At Your Door Step',
      siteDescription: 'Premium organic products delivered to your doorstep',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      language: 'en',
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      orderAlerts: true,
      stockAlerts: true,
      systemAlerts: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 60,
      passwordPolicy: 'strong',
      ipWhitelist: [],
    },
    payment: {
      enableCOD: true,
      enableOnline: true,
      enableUPI: true,
      enableCards: false,
      processingFee: 2.5,
    },
    shipping: {
      defaultShippingCost: 50,
      freeShippingThreshold: 1000,
      maxDeliveryDays: 7,
      enableExpressDelivery: true,
      expressDeliveryFee: 100,
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      cacheEnabled: true,
      autoBackup: true,
      backupFrequency: 'daily',
    },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'general', label: 'General', icon: FiSettings },
    { id: 'notifications', label: 'Notifications', icon: FiMail },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'payment', label: 'Payment', icon: FiCreditCard },
    { id: 'shipping', label: 'Shipping', icon: FiTruck },
    { id: 'system', label: 'System', icon: FiDatabase },
  ];

  useEffect(() => {
    // In a real app, this would load settings from API
    setHasChanges(false);
  }, []);

  const handleInputChange = (
    section: keyof SettingsData,
    field: string,
    value: string | number | boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleToggle = (section: keyof SettingsData, field: string) => {
    const currentValue = (settings[section] as Record<string, unknown>)[field];
    handleInputChange(section, field, !currentValue);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would save to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasChanges(false);
      // Show success message
    } catch (error) {
      console.error('Failed to save settings:', error);
      // Show error message
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all settings to default values?'
      )
    ) {
      // Reset to default values
      setHasChanges(true);
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'settings-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          setHasChanges(true);
        } catch (error) {
          console.error('Failed to import settings:', error);
          alert('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  const renderProfileTab = () => (
    <div className="settings-section">
      <h2>Profile Settings</h2>
      <div className="settings-grid">
        <div className="setting-group">
          <label>Full Name</label>
          <input
            type="text"
            value={settings.profile.name}
            onChange={e => handleInputChange('profile', 'name', e.target.value)}
          />
        </div>
        <div className="setting-group">
          <label>Email Address</label>
          <input
            type="email"
            value={settings.profile.email}
            onChange={e =>
              handleInputChange('profile', 'email', e.target.value)
            }
          />
        </div>
        <div className="setting-group">
          <label>Phone Number</label>
          <input
            type="tel"
            value={settings.profile.phone}
            onChange={e =>
              handleInputChange('profile', 'phone', e.target.value)
            }
          />
        </div>
        <div className="setting-group">
          <label>Role</label>
          <select
            value={settings.profile.role}
            onChange={e => handleInputChange('profile', 'role', e.target.value)}
          >
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn btn-secondary">
          <FiLock />
          Change Password
        </button>
        <button className="btn btn-secondary">
          <FiUpload />
          Upload Avatar
        </button>
      </div>
    </div>
  );

  const renderGeneralTab = () => (
    <div className="settings-section">
      <h2>General Settings</h2>
      <div className="settings-grid">
        <div className="setting-group">
          <label>Site Name</label>
          <input
            type="text"
            value={settings.general.siteName}
            onChange={e =>
              handleInputChange('general', 'siteName', e.target.value)
            }
          />
        </div>
        <div className="setting-group full-width">
          <label>Site Description</label>
          <textarea
            value={settings.general.siteDescription}
            onChange={e =>
              handleInputChange('general', 'siteDescription', e.target.value)
            }
            rows={3}
          />
        </div>
        <div className="setting-group">
          <label>Currency</label>
          <select
            value={settings.general.currency}
            onChange={e =>
              handleInputChange('general', 'currency', e.target.value)
            }
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
        <div className="setting-group">
          <label>Timezone</label>
          <select
            value={settings.general.timezone}
            onChange={e =>
              handleInputChange('general', 'timezone', e.target.value)
            }
          >
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
          </select>
        </div>
        <div className="setting-group">
          <label>Language</label>
          <select
            value={settings.general.language}
            onChange={e =>
              handleInputChange('general', 'language', e.target.value)
            }
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="mr">Marathi</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="settings-section">
      <h2>Notification Settings</h2>
      <div className="toggle-list">
        <div className="toggle-item">
          <div className="toggle-info">
            <h3>Email Notifications</h3>
            <p>Receive notifications via email</p>
          </div>
          <button
            className={`toggle-btn ${settings.notifications.emailNotifications ? 'active' : ''}`}
            onClick={() => handleToggle('notifications', 'emailNotifications')}
          >
            {settings.notifications.emailNotifications ? (
              <FiToggleRight />
            ) : (
              <FiToggleLeft />
            )}
          </button>
        </div>
        <div className="toggle-item">
          <div className="toggle-info">
            <h3>SMS Notifications</h3>
            <p>Receive notifications via SMS</p>
          </div>
          <button
            className={`toggle-btn ${settings.notifications.smsNotifications ? 'active' : ''}`}
            onClick={() => handleToggle('notifications', 'smsNotifications')}
          >
            {settings.notifications.smsNotifications ? (
              <FiToggleRight />
            ) : (
              <FiToggleLeft />
            )}
          </button>
        </div>
        <div className="toggle-item">
          <div className="toggle-info">
            <h3>Order Alerts</h3>
            <p>Get notified about new orders</p>
          </div>
          <button
            className={`toggle-btn ${settings.notifications.orderAlerts ? 'active' : ''}`}
            onClick={() => handleToggle('notifications', 'orderAlerts')}
          >
            {settings.notifications.orderAlerts ? (
              <FiToggleRight />
            ) : (
              <FiToggleLeft />
            )}
          </button>
        </div>
        <div className="toggle-item">
          <div className="toggle-info">
            <h3>Stock Alerts</h3>
            <p>Get notified about low stock items</p>
          </div>
          <button
            className={`toggle-btn ${settings.notifications.stockAlerts ? 'active' : ''}`}
            onClick={() => handleToggle('notifications', 'stockAlerts')}
          >
            {settings.notifications.stockAlerts ? (
              <FiToggleRight />
            ) : (
              <FiToggleLeft />
            )}
          </button>
        </div>
        <div className="toggle-item">
          <div className="toggle-info">
            <h3>System Alerts</h3>
            <p>Get notified about system events</p>
          </div>
          <button
            className={`toggle-btn ${settings.notifications.systemAlerts ? 'active' : ''}`}
            onClick={() => handleToggle('notifications', 'systemAlerts')}
          >
            {settings.notifications.systemAlerts ? (
              <FiToggleRight />
            ) : (
              <FiToggleLeft />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="settings-section">
      <h2>Security Settings</h2>
      <div className="toggle-list">
        <div className="toggle-item">
          <div className="toggle-info">
            <h3>Two-Factor Authentication</h3>
            <p>Add an extra layer of security to your account</p>
          </div>
          <button
            className={`toggle-btn ${settings.security.twoFactorAuth ? 'active' : ''}`}
            onClick={() => handleToggle('security', 'twoFactorAuth')}
          >
            {settings.security.twoFactorAuth ? (
              <FiToggleRight />
            ) : (
              <FiToggleLeft />
            )}
          </button>
        </div>
      </div>

      <div className="settings-grid">
        <div className="setting-group">
          <label>Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={e =>
              handleInputChange(
                'security',
                'sessionTimeout',
                parseInt(e.target.value)
              )
            }
            min="15"
            max="480"
          />
        </div>
        <div className="setting-group">
          <label>Password Policy</label>
          <select
            value={settings.security.passwordPolicy}
            onChange={e =>
              handleInputChange('security', 'passwordPolicy', e.target.value)
            }
          >
            <option value="basic">Basic (8+ characters)</option>
            <option value="strong">Strong (8+ chars, numbers, symbols)</option>
            <option value="complex">
              Complex (12+ chars, mixed case, numbers, symbols)
            </option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderPaymentTab = () => (
    <div className="settings-section">
      <h2>Payment Settings</h2>
      <div className="toggle-list">
        <div className="toggle-item">
          <div className="toggle-info">
            <h3>Cash on Delivery</h3>
            <p>Allow customers to pay on delivery</p>
          </div>
          <button
            className={`toggle-btn ${settings.payment.enableCOD ? 'active' : ''}`}
            onClick={() => handleToggle('payment', 'enableCOD')}
          >
            {settings.payment.enableCOD ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </div>
        <div className="toggle-item">
          <div className="toggle-info">
            <h3>Online Payments</h3>
            <p>Accept online payments via payment gateway</p>
          </div>
          <button
            className={`toggle-btn ${settings.payment.enableOnline ? 'active' : ''}`}
            onClick={() => handleToggle('payment', 'enableOnline')}
          >
            {settings.payment.enableOnline ? (
              <FiToggleRight />
            ) : (
              <FiToggleLeft />
            )}
          </button>
        </div>
        <div className="toggle-item">
          <div className="toggle-info">
            <h3>UPI Payments</h3>
            <p>Accept payments via UPI</p>
          </div>
          <button
            className={`toggle-btn ${settings.payment.enableUPI ? 'active' : ''}`}
            onClick={() => handleToggle('payment', 'enableUPI')}
          >
            {settings.payment.enableUPI ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </div>
        <div className="toggle-item">
          <div className="toggle-info">
            <h3>Card Payments</h3>
            <p>Accept credit/debit card payments</p>
          </div>
          <button
            className={`toggle-btn ${settings.payment.enableCards ? 'active' : ''}`}
            onClick={() => handleToggle('payment', 'enableCards')}
          >
            {settings.payment.enableCards ? (
              <FiToggleRight />
            ) : (
              <FiToggleLeft />
            )}
          </button>
        </div>
      </div>

      <div className="settings-grid">
        <div className="setting-group">
          <label>Processing Fee (%)</label>
          <input
            type="number"
            value={settings.payment.processingFee}
            onChange={e =>
              handleInputChange(
                'payment',
                'processingFee',
                parseFloat(e.target.value)
              )
            }
            min="0"
            max="10"
            step="0.1"
          />
        </div>
      </div>
    </div>
  );

  const renderShippingTab = () => (
    <div className="settings-section">
      <h2>Shipping Settings</h2>
      <div className="settings-grid">
        <div className="setting-group">
          <label>Default Shipping Cost (₹)</label>
          <input
            type="number"
            value={settings.shipping.defaultShippingCost}
            onChange={e =>
              handleInputChange(
                'shipping',
                'defaultShippingCost',
                parseInt(e.target.value)
              )
            }
            min="0"
          />
        </div>
        <div className="setting-group">
          <label>Free Shipping Threshold (₹)</label>
          <input
            type="number"
            value={settings.shipping.freeShippingThreshold}
            onChange={e =>
              handleInputChange(
                'shipping',
                'freeShippingThreshold',
                parseInt(e.target.value)
              )
            }
            min="0"
          />
        </div>
        <div className="setting-group">
          <label>Max Delivery Days</label>
          <input
            type="number"
            value={settings.shipping.maxDeliveryDays}
            onChange={e =>
              handleInputChange(
                'shipping',
                'maxDeliveryDays',
                parseInt(e.target.value)
              )
            }
            min="1"
            max="30"
          />
        </div>
        <div className="setting-group">
          <label>Express Delivery Fee (₹)</label>
          <input
            type="number"
            value={settings.shipping.expressDeliveryFee}
            onChange={e =>
              handleInputChange(
                'shipping',
                'expressDeliveryFee',
                parseInt(e.target.value)
              )
            }
            min="0"
          />
        </div>
      </div>

      <div className="toggle-list">
        <div className="toggle-item">
          <div className="toggle-info">
            <h3>Express Delivery</h3>
            <p>Offer express delivery option to customers</p>
          </div>
          <button
            className={`toggle-btn ${settings.shipping.enableExpressDelivery ? 'active' : ''}`}
            onClick={() => handleToggle('shipping', 'enableExpressDelivery')}
          >
            {settings.shipping.enableExpressDelivery ? (
              <FiToggleRight />
            ) : (
              <FiToggleLeft />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="settings-section">
      <h2>System Settings</h2>
      <div className="toggle-list">
        <div className="toggle-item">
          <div className="toggle-info">
            <h3>Maintenance Mode</h3>
            <p>Enable maintenance mode for the website</p>
          </div>
          <button
            className={`toggle-btn ${settings.system.maintenanceMode ? 'active' : ''}`}
            onClick={() => handleToggle('system', 'maintenanceMode')}
          >
            {settings.system.maintenanceMode ? (
              <FiToggleRight />
            ) : (
              <FiToggleLeft />
            )}
          </button>
        </div>
        <div className="toggle-item">
          <div className="toggle-info">
            <h3>Debug Mode</h3>
            <p>Enable debug mode for development</p>
          </div>
          <button
            className={`toggle-btn ${settings.system.debugMode ? 'active' : ''}`}
            onClick={() => handleToggle('system', 'debugMode')}
          >
            {settings.system.debugMode ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </div>
        <div className="toggle-item">
          <div className="toggle-info">
            <h3>Cache Enabled</h3>
            <p>Enable caching for better performance</p>
          </div>
          <button
            className={`toggle-btn ${settings.system.cacheEnabled ? 'active' : ''}`}
            onClick={() => handleToggle('system', 'cacheEnabled')}
          >
            {settings.system.cacheEnabled ? (
              <FiToggleRight />
            ) : (
              <FiToggleLeft />
            )}
          </button>
        </div>
        <div className="toggle-item">
          <div className="toggle-info">
            <h3>Auto Backup</h3>
            <p>Automatically backup data</p>
          </div>
          <button
            className={`toggle-btn ${settings.system.autoBackup ? 'active' : ''}`}
            onClick={() => handleToggle('system', 'autoBackup')}
          >
            {settings.system.autoBackup ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </div>
      </div>

      <div className="settings-grid">
        <div className="setting-group">
          <label>Backup Frequency</label>
          <select
            value={settings.system.backupFrequency}
            onChange={e =>
              handleInputChange('system', 'backupFrequency', e.target.value)
            }
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div className="system-actions">
        <button className="btn btn-danger">
          <FiTrash2 />
          Clear Cache
        </button>
        <button className="btn btn-secondary">
          <FiDownload />
          Backup Data
        </button>
        <label className="btn btn-secondary file-input-label">
          <FiUpload />
          Import Settings
          <input
            type="file"
            accept=".json"
            onChange={importSettings}
            style={{ display: 'none' }}
          />
        </label>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'general':
        return renderGeneralTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'security':
        return renderSecurityTab();
      case 'payment':
        return renderPaymentTab();
      case 'shipping':
        return renderShippingTab();
      case 'system':
        return renderSystemTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <div className="header-left">
          <h1>Settings</h1>
          <p className="subtitle">
            Manage your application settings and preferences
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={exportSettings}>
            <FiDownload />
            Export Settings
          </button>
          <button className="btn btn-danger" onClick={handleReset}>
            <FiRefreshCw />
            Reset to Default
          </button>
          <button
            className={`btn btn-primary ${!hasChanges ? 'disabled' : ''}`}
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? <FiRefreshCw className="spinning" /> : <FiSave />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="settings-content">
        <div className="settings-tabs">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconComponent />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="settings-panel">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default Settings;
