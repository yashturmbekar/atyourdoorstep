/**
 * Delivery Settings Management Component
 * Admin interface for managing delivery settings
 * Following Clean Architecture and instruction file standards
 */

import React, { useState } from 'react';
import {
  useDeliverySettings,
  useDeliveryCharges,
} from '../../../hooks/useContent';
import './ContentManagement.css';

interface SettingsFormData {
  defaultDeliveryCharge: number;
  freeDeliveryThreshold: number | null;
  minOrderAmount: number;
  estimatedDeliveryDays: number;
  isDeliveryEnabled: boolean;
}

const initialSettingsFormData: SettingsFormData = {
  defaultDeliveryCharge: 0,
  freeDeliveryThreshold: null,
  minOrderAmount: 0,
  estimatedDeliveryDays: 3,
  isDeliveryEnabled: true,
};

const DeliverySettingsManagement: React.FC = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [settingsFormData, setSettingsFormData] = useState<SettingsFormData>(
    initialSettingsFormData
  );

  // React Query hooks
  const {
    data: settingsData,
    isLoading: settingsLoading,
    error,
  } = useDeliverySettings();
  const { data: chargesData, isLoading: chargesLoading } = useDeliveryCharges();

  const settings = settingsData?.data;
  const charges = chargesData?.data;

  const handleOpenEditModal = () => {
    if (settings) {
      setSettingsFormData({
        defaultDeliveryCharge: settings.defaultDeliveryCharge || 0,
        freeDeliveryThreshold: settings.freeDeliveryThreshold || null,
        minOrderAmount: settings.minOrderAmount || 0,
        estimatedDeliveryDays: settings.estimatedDeliveryDays || 3,
        isDeliveryEnabled: settings.isDeliveryEnabled ?? true,
      });
    }
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSettingsFormData(initialSettingsFormData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setSettingsFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettingsFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleFreeDeliveryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSettingsFormData(prev => ({
      ...prev,
      freeDeliveryThreshold: value ? parseFloat(value) : null,
    }));
  };

  const handleSubmitSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    // Note: Update mutation would be added when backend endpoints are available
    console.log('Submitting settings:', settingsFormData);
    handleCloseEditModal();
  };

  const isLoading = settingsLoading || chargesLoading;

  if (isLoading) {
    return (
      <div className="content-management">
        <div className="loading-state">Loading delivery settings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-management">
        <div className="error-state">
          Failed to load delivery settings. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="content-management">
      <div className="content-header">
        <div>
          <h1>Delivery Settings</h1>
          <p>Manage delivery charges and estimated delivery times</p>
        </div>
        <button className="btn-primary" onClick={handleOpenEditModal}>
          Edit Settings
        </button>
      </div>

      {/* General Settings Card */}
      <div className="settings-card">
        <h3>Current Delivery Settings</h3>
        <div className="settings-grid">
          <div className="setting-item">
            <span className="setting-label">Delivery Enabled</span>
            <span
              className={`status-badge ${settings?.isDeliveryEnabled ? 'status-active' : 'status-inactive'}`}
            >
              {settings?.isDeliveryEnabled ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="setting-item">
            <span className="setting-label">Default Delivery Charge</span>
            <span className="setting-value">
              ₹{settings?.defaultDeliveryCharge || 0}
            </span>
          </div>
          <div className="setting-item">
            <span className="setting-label">Free Delivery Above</span>
            <span className="setting-value">
              {settings?.freeDeliveryThreshold
                ? `₹${settings.freeDeliveryThreshold}`
                : 'Not set'}
            </span>
          </div>
          <div className="setting-item">
            <span className="setting-label">Min Order Amount</span>
            <span className="setting-value">
              ₹{settings?.minOrderAmount || 0}
            </span>
          </div>
          <div className="setting-item">
            <span className="setting-label">Estimated Delivery Days</span>
            <span className="setting-value">
              {settings?.estimatedDeliveryDays || '-'} days
            </span>
          </div>
        </div>
      </div>

      {/* Public Charges Info */}
      {charges && (
        <div className="settings-card">
          <h3>Public Delivery Charges</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <span className="setting-label">Standard Delivery</span>
              <span className="setting-value">
                ₹{charges.standardDeliveryCharge}
              </span>
            </div>
            {charges.expressDeliveryCharge && (
              <div className="setting-item">
                <span className="setting-label">Express Delivery</span>
                <span className="setting-value">
                  ₹{charges.expressDeliveryCharge}
                </span>
              </div>
            )}
            <div className="setting-item">
              <span className="setting-label">Free Delivery Threshold</span>
              <span className="setting-value">
                ₹{charges.freeDeliveryThreshold}
              </span>
            </div>
            <div className="setting-item">
              <span className="setting-label">Estimated Delivery</span>
              <span className="setting-value">
                {charges.estimatedDeliveryDays} days
              </span>
            </div>
            {charges.expressDeliveryDays && (
              <div className="setting-item">
                <span className="setting-label">Express Delivery</span>
                <span className="setting-value">
                  {charges.expressDeliveryDays} days
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Settings Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={handleCloseEditModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Delivery Settings</h2>
              <button className="modal-close" onClick={handleCloseEditModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitSettings}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="defaultDeliveryCharge">
                    Default Delivery Charge (₹)
                  </label>
                  <input
                    type="number"
                    id="defaultDeliveryCharge"
                    name="defaultDeliveryCharge"
                    value={settingsFormData.defaultDeliveryCharge}
                    onChange={handleInputChange}
                    min={0}
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="minOrderAmount">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    id="minOrderAmount"
                    name="minOrderAmount"
                    value={settingsFormData.minOrderAmount}
                    onChange={handleInputChange}
                    min={0}
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="freeDeliveryThreshold">
                  Free Delivery Threshold (₹, leave empty if not applicable)
                </label>
                <input
                  type="number"
                  id="freeDeliveryThreshold"
                  name="freeDeliveryThreshold"
                  value={settingsFormData.freeDeliveryThreshold ?? ''}
                  onChange={handleFreeDeliveryChange}
                  min={0}
                  step="0.01"
                  placeholder="e.g., 500"
                />
              </div>
              <div className="form-group">
                <label htmlFor="estimatedDeliveryDays">
                  Estimated Delivery Days
                </label>
                <input
                  type="number"
                  id="estimatedDeliveryDays"
                  name="estimatedDeliveryDays"
                  value={settingsFormData.estimatedDeliveryDays}
                  onChange={handleInputChange}
                  min={1}
                  required
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isDeliveryEnabled"
                    checked={settingsFormData.isDeliveryEnabled}
                    onChange={handleCheckboxChange}
                  />
                  Enable Delivery
                </label>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseEditModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliverySettingsManagement;
