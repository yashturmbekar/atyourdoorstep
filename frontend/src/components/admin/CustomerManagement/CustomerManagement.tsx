import React, { useState, useEffect, useCallback } from 'react';
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiEdit2,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShoppingBag,
  FiDollarSign,
  FiCalendar,
  FiMoreVertical,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import type { Customer, Order } from '../../../types';
import { adminApi } from '../../../services/adminApi';
import './CustomerManagement.css';

interface CustomerStats {
  totalSpent: number;
  totalOrders: number;
  avgOrderValue: number;
  lastOrderDate: string;
}

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all');
  const [sortBy, setSortBy] = useState<
    'name' | 'email' | 'totalSpent' | 'lastOrder'
  >('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customerStats, setCustomerStats] = useState<
    Record<string, CustomerStats>
  >({});
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 10;

  const calculateCustomerStats = useCallback(
    (orders: Order[]): CustomerStats => {
      const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
      const totalOrders = orders.length;
      const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
      const lastOrderDate =
        orders.length > 0
          ? orders
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )[0]
              .createdAt.toISOString()
          : '';

      return {
        totalSpent,
        totalOrders,
        avgOrderValue,
        lastOrderDate,
      };
    },
    []
  );

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getCustomers();
      setCustomers(response.data);

      // Fetch stats for each customer
      const stats: Record<string, CustomerStats> = {};
      for (const customer of response.data) {
        const orders = await adminApi.getCustomerOrders(customer.id);
        stats[customer.id] = calculateCustomerStats(orders);
      }
      setCustomerStats(stats);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [calculateCustomerStats]);

  const filterAndSortCustomers = useCallback(() => {
    const filtered = customers.filter(customer => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && customer.isActive) ||
        (statusFilter === 'inactive' && !customer.isActive);

      return matchesSearch && matchesStatus;
    });

    // Sort customers
    filtered.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'totalSpent':
          aValue = customerStats[a.id]?.totalSpent || 0;
          bValue = customerStats[b.id]?.totalSpent || 0;
          break;
        case 'lastOrder':
          aValue = new Date(customerStats[a.id]?.lastOrderDate || 0);
          bValue = new Date(customerStats[b.id]?.lastOrderDate || 0);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredCustomers(filtered);
    setCurrentPage(1);
  }, [customers, searchTerm, statusFilter, sortBy, sortOrder, customerStats]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    filterAndSortCustomers();
  }, [filterAndSortCustomers]);

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev =>
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === getCurrentPageCustomers().length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(
        getCurrentPageCustomers().map(customer => customer.id)
      );
    }
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getCurrentPageCustomers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCustomers.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(filteredCustomers.length / itemsPerPage);
  };

  const handleBulkAction = async (
    action: 'activate' | 'deactivate' | 'delete'
  ) => {
    if (selectedCustomers.length === 0) return;

    try {
      switch (action) {
        case 'activate':
          await adminApi.updateCustomersStatus(selectedCustomers, true);
          break;
        case 'deactivate':
          await adminApi.updateCustomersStatus(selectedCustomers, false);
          break;
        case 'delete':
          if (
            window.confirm(
              `Are you sure you want to delete ${selectedCustomers.length} customer(s)?`
            )
          ) {
            await adminApi.deleteCustomers(selectedCustomers);
          }
          break;
      }
      setSelectedCustomers([]);
      fetchCustomers();
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const exportCustomers = () => {
    const csvContent = [
      [
        'Name',
        'Email',
        'Phone',
        'Status',
        'Total Spent',
        'Total Orders',
        'Last Order',
      ].join(','),
      ...filteredCustomers.map(customer =>
        [
          customer.name,
          customer.email,
          customer.phone || '',
          customer.isActive ? 'Active' : 'Inactive',
          customerStats[customer.id]?.totalSpent?.toFixed(2) || '0.00',
          customerStats[customer.id]?.totalOrders || '0',
          customerStats[customer.id]?.lastOrderDate || '',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p>Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="customer-management">
      <div className="customer-management-header">
        <div className="header-left">
          <h1>Customer Management</h1>
          <p className="subtitle">{filteredCustomers.length} customers found</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter />
            Filters
          </button>
          <button className="btn btn-secondary" onClick={exportCustomers}>
            <FiDownload />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="customer-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>Status</label>
              <select
                value={statusFilter}
                onChange={e =>
                  setStatusFilter(
                    e.target.value as 'all' | 'active' | 'inactive'
                  )
                }
              >
                <option value="all">All Customers</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={sortBy}
                onChange={e =>
                  setSortBy(
                    e.target.value as
                      | 'name'
                      | 'email'
                      | 'totalSpent'
                      | 'lastOrder'
                  )
                }
              >
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="totalSpent">Total Spent</option>
                <option value="lastOrder">Last Order</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Order</label>
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Search and Bulk Actions */}
      <div className="customer-controls">
        <div className="search-controls">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {selectedCustomers.length > 0 && (
          <div className="bulk-actions">
            <span className="selected-count">
              {selectedCustomers.length} selected
            </span>
            <button
              className="btn btn-success btn-sm"
              onClick={() => handleBulkAction('activate')}
            >
              Activate
            </button>
            <button
              className="btn btn-warning btn-sm"
              onClick={() => handleBulkAction('deactivate')}
            >
              Deactivate
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleBulkAction('delete')}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Customer Table */}
      <div className="customer-table-container">
        <table className="customer-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    selectedCustomers.length ===
                      getCurrentPageCustomers().length &&
                    getCurrentPageCustomers().length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th onClick={() => handleSort('name')} className="sortable">
                Customer{' '}
                {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('email')} className="sortable">
                Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Phone</th>
              <th>Address</th>
              <th onClick={() => handleSort('totalSpent')} className="sortable">
                Total Spent{' '}
                {sortBy === 'totalSpent' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Orders</th>
              <th onClick={() => handleSort('lastOrder')} className="sortable">
                Last Order{' '}
                {sortBy === 'lastOrder' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getCurrentPageCustomers().map(customer => (
              <tr key={customer.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCustomers.includes(customer.id)}
                    onChange={() => handleSelectCustomer(customer.id)}
                  />
                </td>
                <td>
                  <div className="customer-info">
                    <div className="customer-avatar">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="customer-name">{customer.name}</div>
                      <div className="customer-id">ID: {customer.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="customer-email">
                    <FiMail className="icon" />
                    {customer.email}
                  </div>
                </td>
                <td>
                  {customer.phone ? (
                    <div className="customer-phone">
                      <FiPhone className="icon" />
                      {customer.phone}
                    </div>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td>
                  {customer.address ? (
                    <div className="customer-address">
                      <FiMapPin className="icon" />
                      <span className="address-text">
                        {customer.address.street}, {customer.address.city}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td>
                  <div className="customer-spent">
                    <FiDollarSign className="icon" />$
                    {customerStats[customer.id]?.totalSpent?.toFixed(2) ||
                      '0.00'}
                  </div>
                </td>
                <td>
                  <div className="customer-orders">
                    <FiShoppingBag className="icon" />
                    {customerStats[customer.id]?.totalOrders || 0}
                  </div>
                </td>
                <td>
                  {customerStats[customer.id]?.lastOrderDate ? (
                    <div className="customer-last-order">
                      <FiCalendar className="icon" />
                      {new Date(
                        customerStats[customer.id].lastOrderDate
                      ).toLocaleDateString()}
                    </div>
                  ) : (
                    <span className="text-muted">Never</span>
                  )}
                </td>
                <td>
                  <span
                    className={`status-badge ${customer.isActive ? 'active' : 'inactive'}`}
                  >
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="btn-icon"
                      onClick={() => setSelectedCustomer(customer)}
                      title="View Details"
                    >
                      <FiEye />
                    </button>
                    <button className="btn-icon" title="Edit Customer">
                      <FiEdit2 />
                    </button>
                    <div className="dropdown">
                      <button className="btn-icon dropdown-toggle">
                        <FiMoreVertical />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {getTotalPages() > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <FiChevronLeft />
          </button>

          <div className="pagination-info">
            Page {currentPage} of {getTotalPages()}
          </div>

          <button
            className="pagination-btn"
            onClick={() =>
              setCurrentPage(prev => Math.min(prev + 1, getTotalPages()))
            }
            disabled={currentPage === getTotalPages()}
          >
            <FiChevronRight />
          </button>
        </div>
      )}

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="modal customer-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Customer Details</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedCustomer(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="customer-details">
                <div className="customer-overview">
                  <div className="customer-avatar-large">
                    {selectedCustomer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="customer-basic-info">
                    <h3>{selectedCustomer.name}</h3>
                    <p className="customer-email">{selectedCustomer.email}</p>
                    {selectedCustomer.phone && (
                      <p className="customer-phone">{selectedCustomer.phone}</p>
                    )}
                    <span
                      className={`status-badge ${selectedCustomer.isActive ? 'active' : 'inactive'}`}
                    >
                      {selectedCustomer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="customer-stats-grid">
                  <div className="stat-card">
                    <FiDollarSign className="stat-icon" />
                    <div className="stat-value">
                      $
                      {customerStats[selectedCustomer.id]?.totalSpent?.toFixed(
                        2
                      ) || '0.00'}
                    </div>
                    <div className="stat-label">Total Spent</div>
                  </div>
                  <div className="stat-card">
                    <FiShoppingBag className="stat-icon" />
                    <div className="stat-value">
                      {customerStats[selectedCustomer.id]?.totalOrders || 0}
                    </div>
                    <div className="stat-label">Total Orders</div>
                  </div>
                  <div className="stat-card">
                    <FiDollarSign className="stat-icon" />
                    <div className="stat-value">
                      $
                      {customerStats[
                        selectedCustomer.id
                      ]?.avgOrderValue?.toFixed(2) || '0.00'}
                    </div>
                    <div className="stat-label">Avg Order Value</div>
                  </div>
                  <div className="stat-card">
                    <FiCalendar className="stat-icon" />
                    <div className="stat-value">
                      {customerStats[selectedCustomer.id]?.lastOrderDate
                        ? new Date(
                            customerStats[selectedCustomer.id].lastOrderDate
                          ).toLocaleDateString()
                        : 'Never'}
                    </div>
                    <div className="stat-label">Last Order</div>
                  </div>
                </div>

                {selectedCustomer.address && (
                  <div className="customer-address-section">
                    <h4>Address</h4>
                    <div className="address-details">
                      <p>{selectedCustomer.address.street}</p>
                      <p>
                        {selectedCustomer.address.city},{' '}
                        {selectedCustomer.address.state}{' '}
                        {selectedCustomer.address.zipCode}
                      </p>
                      <p>{selectedCustomer.address.country}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
