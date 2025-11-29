/**
 * Settings Component
 * Admin settings page with tabbed interface
 * Connects to backend API for persistent storage
 * Following Clean Architecture and instruction file standards
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  FiUpload,
  FiDownload,
  FiToggleLeft,
  FiToggleRight,
  FiAlertCircle,
  FiCheck,
  FiLoader,
} from 'react-icons/fi';
import {
  siteSettingsService,
  deliverySettingsService,
} from '../../../services/contentService';
import type {
  SiteSettingResponseDto,
  DeliverySettingsResponseDto,
  CreateSiteSettingRequestDto,
  UpdateSiteSettingRequestDto,
  UpdateDeliverySettingsRequestDto,
} from '../../../types/content.types';
import { useAdminAuth } from '../../../hooks/useAdminAuth';
import './Settings.css';

// ============================================
// Types
// ============================================

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

// Map site settings to local state structure
const mapSiteSettingsToState = (
  settings: SiteSettingResponseDto[]
): Partial<SettingsData> => {
  const settingsMap = settings.reduce(
    (acc, s) => {
      acc[s.key] = s.value;
      return acc;
    },
    {} as Record<string, string>
  );

  return {
    general: {
      siteName: settingsMap['site_name'] || 'At Your Door Step',
      siteDescription:
        settingsMap['site_description'] ||
        'Premium organic products delivered to your doorstep',
      currency: settingsMap['currency'] || 'INR',
      timezone: settingsMap['timezone'] || 'Asia/Kolkata',
      language: settingsMap['language'] || 'en',
    },
    notifications: {
      emailNotifications: settingsMap['email_notifications'] === 'true',
      smsNotifications: settingsMap['sms_notifications'] === 'true',
      orderAlerts: settingsMap['order_alerts'] !== 'false',
      stockAlerts: settingsMap['stock_alerts'] !== 'false',
      systemAlerts: settingsMap['system_alerts'] !== 'false',
    },
    security: {
      twoFactorAuth: settingsMap['two_factor_auth'] === 'true',
      sessionTimeout: parseInt(settingsMap['session_timeout'] || '60'),
      passwordPolicy: settingsMap['password_policy'] || 'strong',
      ipWhitelist: settingsMap['ip_whitelist']
        ? JSON.parse(settingsMap['ip_whitelist'])
        : [],
    },
    payment: {
      enableCOD: settingsMap['enable_cod'] !== 'false',
      enableOnline: settingsMap['enable_online'] !== 'false',
      enableUPI: settingsMap['enable_upi'] !== 'false',
      enableCards: settingsMap['enable_cards'] === 'true',
      processingFee: parseFloat(settingsMap['processing_fee'] || '2.5'),
    },
    system: {
      maintenanceMode: settingsMap['maintenance_mode'] === 'true',
      debugMode: settingsMap['debug_mode'] === 'true',
      cacheEnabled: settingsMap['cache_enabled'] !== 'false',
      autoBackup: settingsMap['auto_backup'] !== 'false',
      backupFrequency: settingsMap['backup_frequency'] || 'daily',
    },
  };
};

// Map delivery settings to shipping state
const mapDeliveryToShipping = (
  delivery: DeliverySettingsResponseDto | null
): SettingsData['shipping'] => {
  if (!delivery) {
    return {
      defaultShippingCost: 50,
      freeShippingThreshold: 1000,
      maxDeliveryDays: 7,
      enableExpressDelivery: true,
      expressDeliveryFee: 100,
    };
  }
  return {
    defaultShippingCost: delivery.defaultDeliveryCharge ?? 50,
    freeShippingThreshold: delivery.freeDeliveryThreshold ?? 1000,
    maxDeliveryDays: delivery.estimatedDeliveryDays ?? 7,
    enableExpressDelivery: (delivery.expressDeliveryDays ?? 0) > 0,
    expressDeliveryFee: 100, // Not stored separately in API
  };
};

// Default settings state
const getDefaultSettings = (): SettingsData => ({
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

// Setting keys mapping for saving
const settingKeyGroups: Record<
  string,
  { group: string; description: string; isPublic: boolean }
> = {
  site_name: { group: 'general', description: 'Site Name', isPublic: true },
  site_description: {
    group: 'general',
    description: 'Site Description',
    isPublic: true,
  },
  currency: { group: 'general', description: 'Currency', isPublic: true },
  timezone: { group: 'general', description: 'Timezone', isPublic: false },
  language: { group: 'general', description: 'Language', isPublic: true },
  email_notifications: {
    group: 'notification',
    description: 'Email Notifications',
    isPublic: false,
  },
  sms_notifications: {
    group: 'notification',
    description: 'SMS Notifications',
    isPublic: false,
  },
  order_alerts: {
    group: 'notification',
    description: 'Order Alerts',
    isPublic: false,
  },
  stock_alerts: {
    group: 'notification',
    description: 'Stock Alerts',
    isPublic: false,
  },
  system_alerts: {
    group: 'notification',
    description: 'System Alerts',
    isPublic: false,
  },
  two_factor_auth: {
    group: 'security',
    description: 'Two Factor Authentication',
    isPublic: false,
  },
  session_timeout: {
    group: 'security',
    description: 'Session Timeout (minutes)',
    isPublic: false,
  },
  password_policy: {
    group: 'security',
    description: 'Password Policy',
    isPublic: false,
  },
  ip_whitelist: {
    group: 'security',
    description: 'IP Whitelist',
    isPublic: false,
  },
  enable_cod: {
    group: 'payment',
    description: 'Enable Cash on Delivery',
    isPublic: true,
  },
  enable_online: {
    group: 'payment',
    description: 'Enable Online Payments',
    isPublic: true,
  },
  enable_upi: {
    group: 'payment',
    description: 'Enable UPI Payments',
    isPublic: true,
  },
  enable_cards: {
    group: 'payment',
    description: 'Enable Card Payments',
    isPublic: true,
  },
  processing_fee: {
    group: 'payment',
    description: 'Processing Fee Percentage',
    isPublic: false,
  },
  maintenance_mode: {
    group: 'system',
    description: 'Maintenance Mode',
    isPublic: false,
  },
  debug_mode: { group: 'system', description: 'Debug Mode', isPublic: false },
  cache_enabled: {
    group: 'system',
    description: 'Cache Enabled',
    isPublic: false,
  },
  auto_backup: {
    group: 'system',
    description: 'Auto Backup',
    isPublic: false,
  },
  backup_frequency: {
    group: 'system',
    description: 'Backup Frequency',
    isPublic: false,
  },
};

// ============================================
// Component
// ============================================

const Settings: React.FC = () => {
  const queryClient = useQueryClient();
  const { adminUser } = useAdminAuth();

  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState<SettingsData>(getDefaultSettings());
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // ============================================
  // API Queries
  // ============================================

  // Fetch all site settings
  const {
    data: siteSettingsData,
    isLoading: isLoadingSiteSettings,
    error: siteSettingsError,
  } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const response = await siteSettingsService.getAll();
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch delivery settings
  const {
    data: deliverySettingsData,
    isLoading: isLoadingDelivery,
    error: deliveryError,
  } = useQuery({
    queryKey: ['deliverySettings'],
    queryFn: async () => {
      const response = await deliverySettingsService.get();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // ============================================
  // Mutations
  // ============================================

  // Create or update site setting mutation
  const saveSiteSettingMutation = useMutation({
    mutationFn: async ({
      key,
      value,
      existingSettings,
    }: {
      key: string;
      value: string;
      existingSettings: SiteSettingResponseDto[];
    }) => {
      const existing = existingSettings.find(s => s.key === key);
      const config = settingKeyGroups[key];

      if (existing) {
        // Update existing
        const updateData: UpdateSiteSettingRequestDto = {
          value,
          description: config?.description,
          isPublic: config?.isPublic ?? false,
        };
        return siteSettingsService.update(key, updateData);
      } else {
        // Create new
        const createData: CreateSiteSettingRequestDto = {
          key,
          value,
          group: config?.group || 'other',
          description: config?.description,
          isPublic: config?.isPublic ?? false,
        };
        return siteSettingsService.create(createData);
      }
    },
  });

  // Update delivery settings mutation
  const saveDeliveryMutation = useMutation({
    mutationFn: async (data: UpdateDeliverySettingsRequestDto) => {
      return deliverySettingsService.update(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliverySettings'] });
    },
  });

  // ============================================
  // Effects
  // ============================================

  // Load settings from API
  useEffect(() => {
    if (siteSettingsData || deliverySettingsData) {
      setSettings(prev => {
        const siteSettingsState = siteSettingsData
          ? mapSiteSettingsToState(siteSettingsData)
          : {};
        const shippingState = deliverySettingsData
          ? mapDeliveryToShipping(deliverySettingsData)
          : prev.shipping;

        return {
          ...prev,
          ...siteSettingsState,
          shipping: shippingState,
          profile: {
            ...prev.profile,
            name: adminUser?.name || prev.profile.name,
            email: adminUser?.email || prev.profile.email,
          },
        };
      });
      setHasChanges(false);
    }
  }, [siteSettingsData, deliverySettingsData, adminUser]);

  // Clear save message after 3 seconds
  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => setSaveMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  // ============================================
  // Handlers
  // ============================================

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'general', label: 'General', icon: FiSettings },
    { id: 'notifications', label: 'Notifications', icon: FiMail },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'payment', label: 'Payment', icon: FiCreditCard },
    { id: 'shipping', label: 'Shipping', icon: FiTruck },
    { id: 'system', label: 'System', icon: FiDatabase },
  ];

  const handleInputChange = useCallback(
    (
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
    },
    []
  );

  const handleToggle = useCallback(
    (section: keyof SettingsData, field: string) => {
      const currentValue = (settings[section] as Record<string, unknown>)[
        field
      ];
      handleInputChange(section, field, !currentValue);
    },
    [settings, handleInputChange]
  );

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const existingSettings = siteSettingsData || [];

      // Prepare all settings to save
      const settingsToSave: { key: string; value: string }[] = [
        // General settings
        { key: 'site_name', value: settings.general.siteName },
        { key: 'site_description', value: settings.general.siteDescription },
        { key: 'currency', value: settings.general.currency },
        { key: 'timezone', value: settings.general.timezone },
        { key: 'language', value: settings.general.language },
        // Notification settings
        {
          key: 'email_notifications',
          value: String(settings.notifications.emailNotifications),
        },
        {
          key: 'sms_notifications',
          value: String(settings.notifications.smsNotifications),
        },
        {
          key: 'order_alerts',
          value: String(settings.notifications.orderAlerts),
        },
        {
          key: 'stock_alerts',
          value: String(settings.notifications.stockAlerts),
        },
        {
          key: 'system_alerts',
          value: String(settings.notifications.systemAlerts),
        },
        // Security settings
        {
          key: 'two_factor_auth',
          value: String(settings.security.twoFactorAuth),
        },
        {
          key: 'session_timeout',
          value: String(settings.security.sessionTimeout),
        },
        { key: 'password_policy', value: settings.security.passwordPolicy },
        {
          key: 'ip_whitelist',
          value: JSON.stringify(settings.security.ipWhitelist),
        },
        // Payment settings
        { key: 'enable_cod', value: String(settings.payment.enableCOD) },
        { key: 'enable_online', value: String(settings.payment.enableOnline) },
        { key: 'enable_upi', value: String(settings.payment.enableUPI) },
        { key: 'enable_cards', value: String(settings.payment.enableCards) },
        {
          key: 'processing_fee',
          value: String(settings.payment.processingFee),
        },
        // System settings
        {
          key: 'maintenance_mode',
          value: String(settings.system.maintenanceMode),
        },
        { key: 'debug_mode', value: String(settings.system.debugMode) },
        { key: 'cache_enabled', value: String(settings.system.cacheEnabled) },
        { key: 'auto_backup', value: String(settings.system.autoBackup) },
        { key: 'backup_frequency', value: settings.system.backupFrequency },
      ];

      // Save all settings
      await Promise.all(
        settingsToSave.map(({ key, value }) =>
          saveSiteSettingMutation.mutateAsync({
            key,
            value,
            existingSettings,
          })
        )
      );

      // Save delivery/shipping settings
      const deliveryData: UpdateDeliverySettingsRequestDto = {
        standardDeliveryCharge: settings.shipping.defaultShippingCost,
        freeDeliveryThreshold: settings.shipping.freeShippingThreshold,
        estimatedDeliveryDays: settings.shipping.maxDeliveryDays,
        expressDeliveryDays: settings.shipping.enableExpressDelivery ? 2 : 0,
        expressDeliveryCharge: settings.shipping.expressDeliveryFee,
      };
      await saveDeliveryMutation.mutateAsync(deliveryData);

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['siteSettings'] });

      setHasChanges(false);
      setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveMessage({
        type: 'error',
        text: 'Failed to save settings. Please try again.',
      });
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
      setSettings(getDefaultSettings());
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
          setSettings(prev => ({ ...prev, ...importedSettings }));
          setHasChanges(true);
          setSaveMessage({
            type: 'success',
            text: 'Settings imported. Click Save to apply.',
          });
        } catch (error) {
          console.error('Failed to import settings:', error);
          setSaveMessage({ type: 'error', text: 'Invalid settings file' });
        }
      };
      reader.readAsText(file);
    }
  };

  // ============================================
  // Loading and Error States
  // ============================================

  const isLoading = isLoadingSiteSettings || isLoadingDelivery;
  const hasError = siteSettingsError || deliveryError;

  // ============================================
  // Render Functions
  // ============================================

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
            disabled
          />
          <small className="input-hint">
            Email can only be changed from Auth settings
          </small>
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
            disabled
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
      <p className="section-description">
        Configure how you receive alerts and notifications from the system.
      </p>
      <div className="toggle-list">
        <div className="toggle-item">
          <div className="toggle-info">
            <h3>Email Notifications</h3>
            <p>Receive notifications via email</p>
          </div>
          <button
            className={`toggle-btn ${settings.notifications.emailNotifications ? 'active' : ''}`}
            onClick={() => handleToggle('notifications', 'emailNotifications')}
            aria-pressed={settings.notifications.emailNotifications}
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
            aria-pressed={settings.notifications.smsNotifications}
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
            <p>Get notified about new orders and order updates</p>
          </div>
          <button
            className={`toggle-btn ${settings.notifications.orderAlerts ? 'active' : ''}`}
            onClick={() => handleToggle('notifications', 'orderAlerts')}
            aria-pressed={settings.notifications.orderAlerts}
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
            <p>Get notified when products are running low on stock</p>
          </div>
          <button
            className={`toggle-btn ${settings.notifications.stockAlerts ? 'active' : ''}`}
            onClick={() => handleToggle('notifications', 'stockAlerts')}
            aria-pressed={settings.notifications.stockAlerts}
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
            <p>Get notified about system events and updates</p>
          </div>
          <button
            className={`toggle-btn ${settings.notifications.systemAlerts ? 'active' : ''}`}
            onClick={() => handleToggle('notifications', 'systemAlerts')}
            aria-pressed={settings.notifications.systemAlerts}
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
      <p className="section-description">
        Manage your account security and access controls.
      </p>
      <div className="toggle-list">
        <div className="toggle-item">
          <div className="toggle-info">
            <h3>Two-Factor Authentication</h3>
            <p>Add an extra layer of security to your account</p>
          </div>
          <button
            className={`toggle-btn ${settings.security.twoFactorAuth ? 'active' : ''}`}
            onClick={() => handleToggle('security', 'twoFactorAuth')}
            aria-pressed={settings.security.twoFactorAuth}
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
                parseInt(e.target.value) || 60
              )
            }
            min="15"
            max="480"
          />
          <small className="input-hint">
            Sessions will expire after this many minutes of inactivity
          </small>
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
      <p className="section-description">
        Configure payment methods and processing options for your store.
      </p>
      <div className="toggle-list">
        <div className="toggle-item">
          <div className="toggle-info">
            <h3>Cash on Delivery</h3>
            <p>Allow customers to pay on delivery</p>
          </div>
          <button
            className={`toggle-btn ${settings.payment.enableCOD ? 'active' : ''}`}
            onClick={() => handleToggle('payment', 'enableCOD')}
            aria-pressed={settings.payment.enableCOD}
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
            aria-pressed={settings.payment.enableOnline}
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
            aria-pressed={settings.payment.enableUPI}
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
            aria-pressed={settings.payment.enableCards}
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
                parseFloat(e.target.value) || 0
              )
            }
            min="0"
            max="10"
            step="0.1"
          />
          <small className="input-hint">
            Additional fee charged for online payments
          </small>
        </div>
      </div>
    </div>
  );

  const renderShippingTab = () => (
    <div className="settings-section">
      <h2>Shipping Settings</h2>
      <p className="section-description">
        Configure delivery options and charges for your store.
      </p>
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
                parseInt(e.target.value) || 0
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
                parseInt(e.target.value) || 0
              )
            }
            min="0"
          />
          <small className="input-hint">
            Orders above this amount get free shipping
          </small>
        </div>
        <div className="setting-group">
          <label>Estimated Delivery Days</label>
          <input
            type="number"
            value={settings.shipping.maxDeliveryDays}
            onChange={e =>
              handleInputChange(
                'shipping',
                'maxDeliveryDays',
                parseInt(e.target.value) || 7
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
                parseInt(e.target.value) || 0
              )
            }
            min="0"
            disabled={!settings.shipping.enableExpressDelivery}
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
            aria-pressed={settings.shipping.enableExpressDelivery}
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
      <p className="section-description">
        Advanced system configurations and maintenance options.
      </p>
      <div className="toggle-list">
        <div className="toggle-item warning-toggle">
          <div className="toggle-info">
            <h3>
              <FiAlertCircle className="warning-icon" />
              Maintenance Mode
            </h3>
            <p>
              Enable maintenance mode for the website (users will see a
              maintenance page)
            </p>
          </div>
          <button
            className={`toggle-btn ${settings.system.maintenanceMode ? 'active warning' : ''}`}
            onClick={() => handleToggle('system', 'maintenanceMode')}
            aria-pressed={settings.system.maintenanceMode}
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
            <p>Enable debug mode for development (shows detailed errors)</p>
          </div>
          <button
            className={`toggle-btn ${settings.system.debugMode ? 'active' : ''}`}
            onClick={() => handleToggle('system', 'debugMode')}
            aria-pressed={settings.system.debugMode}
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
            aria-pressed={settings.system.cacheEnabled}
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
            <p>Automatically backup data on a schedule</p>
          </div>
          <button
            className={`toggle-btn ${settings.system.autoBackup ? 'active' : ''}`}
            onClick={() => handleToggle('system', 'autoBackup')}
            aria-pressed={settings.system.autoBackup}
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
            disabled={!settings.system.autoBackup}
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
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

  // ============================================
  // Main Render
  // ============================================

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div className="header-content">
          <h1>
            <FiSettings />
            Settings
          </h1>
          <p>Manage your store settings and preferences</p>
        </div>
        <div className="header-actions">
          <label className="btn btn-secondary import-btn">
            <FiUpload />
            Import
            <input
              type="file"
              accept=".json"
              onChange={importSettings}
              style={{ display: 'none' }}
            />
          </label>
          <button className="btn btn-secondary" onClick={exportSettings}>
            <FiDownload />
            Export
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={isSaving}
          >
            <FiRefreshCw />
            Reset
          </button>
          <button
            className={`btn btn-primary ${hasChanges ? 'has-changes' : ''}`}
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
          >
            {isSaving ? (
              <>
                <FiLoader className="spin" />
                Saving...
              </>
            ) : (
              <>
                <FiSave />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`save-message ${saveMessage.type}`}>
          {saveMessage.type === 'success' ? <FiCheck /> : <FiAlertCircle />}
          {saveMessage.text}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="loading-overlay">
          <FiLoader className="spin" />
          <span>Loading settings...</span>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="error-banner">
          <FiAlertCircle />
          <span>
            Some settings may not have loaded correctly. Changes will still be
            saved.
          </span>
        </div>
      )}

      <div className="settings-content">
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-panel">{renderActiveTab()}</div>
      </div>
    </div>
  );
};

export default Settings;
