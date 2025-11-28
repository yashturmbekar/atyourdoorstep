/**
 * Notification Service
 * Handles all notification-related API calls to NotificationService
 * Following Clean Architecture and instruction file standards
 */

import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import type {
  ApiResponse,
  PaginatedResponse,
  NotificationResponseDto,
  SubscriptionResponseDto,
  SubscribeRequestDto,
  SendNotificationRequestDto,
  BroadcastNotificationRequestDto,
  MarkAsReadRequestDto,
  NotificationQueryParams,
} from '../types/api.types';

// VAPID public key - should be in environment variables
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

/**
 * Convert URL-safe base64 to Uint8Array for push subscription
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Notification Service - All notification-related API operations
 */
export const notificationService = {
  /**
   * Check if push notifications are supported
   */
  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  },

  /**
   * Request notification permission
   * @returns Permission state
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error('Push notifications are not supported');
    }
    return await Notification.requestPermission();
  },

  /**
   * Subscribe to push notifications
   * @param userId - User ID to associate subscription with
   * @returns Subscription response
   */
  async subscribe(
    userId: string
  ): Promise<ApiResponse<SubscriptionResponseDto>> {
    if (!this.isSupported()) {
      throw new Error('Push notifications are not supported');
    }

    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    // Register service worker if not already registered
    const registration = await navigator.serviceWorker.ready;

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    const json = subscription.toJSON();

    const subscribeData: SubscribeRequestDto = {
      userId,
      endpoint: json.endpoint || '',
      p256dh: json.keys?.p256dh || '',
      auth: json.keys?.auth || '',
    };

    const response = await apiClient.post<ApiResponse<SubscriptionResponseDto>>(
      API_ENDPOINTS.notifications.subscribe,
      subscribeData
    );
    return response.data;
  },

  /**
   * Unsubscribe from push notifications
   * @param subscriptionId - Subscription ID to remove
   */
  async unsubscribe(subscriptionId: string): Promise<ApiResponse<void>> {
    // Unsubscribe from browser push
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
    }

    // Remove from server
    const response = await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.notifications.unsubscribe(subscriptionId)
    );
    return response.data;
  },

  /**
   * Send notification to specific user (Admin only)
   * @param data - Notification data
   */
  async sendNotification(
    data: SendNotificationRequestDto
  ): Promise<ApiResponse<NotificationResponseDto>> {
    const response = await apiClient.post<ApiResponse<NotificationResponseDto>>(
      API_ENDPOINTS.notifications.send,
      data
    );
    return response.data;
  },

  /**
   * Broadcast notification to all subscribers (Admin only)
   * @param data - Broadcast notification data
   */
  async broadcastNotification(
    data: BroadcastNotificationRequestDto
  ): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(
      API_ENDPOINTS.notifications.broadcast,
      data
    );
    return response.data;
  },

  /**
   * Get user's notifications
   * @param userId - User ID
   * @param params - Query parameters for pagination
   * @returns Paginated list of notifications
   */
  async getNotifications(
    userId: string,
    params: NotificationQueryParams = {}
  ): Promise<PaginatedResponse<NotificationResponseDto>> {
    const { page = 1, pageSize = 20 } = params;

    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('pageSize', pageSize.toString());

    const response = await apiClient.get<
      PaginatedResponse<NotificationResponseDto>
    >(`${API_ENDPOINTS.notifications.list(userId)}?${queryParams.toString()}`);
    return response.data;
  },

  /**
   * Mark notification as read
   * @param data - Mark as read request data
   */
  async markAsRead(data: MarkAsReadRequestDto): Promise<ApiResponse<void>> {
    const response = await apiClient.put<ApiResponse<void>>(
      API_ENDPOINTS.notifications.markRead,
      data
    );
    return response.data;
  },

  /**
   * Get unread notification count
   * @param userId - User ID
   * @returns Unread count
   */
  async getUnreadCount(userId: string): Promise<ApiResponse<number>> {
    const response = await apiClient.get<ApiResponse<number>>(
      API_ENDPOINTS.notifications.unreadCount(userId)
    );
    return response.data;
  },
};

export default notificationService;
