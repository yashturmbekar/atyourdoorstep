// Utility functions
export * from './seo';

/**
 * Format a date to a readable string
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Debounce function to limit the rate of function calls
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Generate a random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Capitalize the first letter of a string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Format price in Indian Rupees
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Calculate total price for order items
 */
export const calculateTotal = (
  items: { price: number; quantity: number }[]
): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

/**
 * Calculate delivery charge based on order total
 */
export const calculateDeliveryCharge = (
  orderTotal: number,
  freeDeliveryThreshold: number = 1000,
  standardCharge: number = 50
): number => {
  return orderTotal >= freeDeliveryThreshold ? 0 : standardCharge;
};

/**
 * Validate phone number (Indian format)
 */
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate email address
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate pincode (Indian format)
 */
export const validatePincode = (pincode: string): boolean => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

// ============================================
// Image Utility Functions
// ============================================

/**
 * Convert a File to base64 string
 * @param file The file to convert
 * @returns Promise with base64 string and content type
 */
export const fileToBase64 = (
  file: File
): Promise<{ base64: string; contentType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve({
        base64,
        contentType: file.type,
      });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

/**
 * Get image source from base64 data
 * @param imageBase64 The base64 encoded image data
 * @param imageContentType The content type of the image (e.g., "image/png")
 * @param defaultImage Optional default image if base64 is not available
 * @returns The image source string (data URL) or default image
 */
export const getImageSrc = (
  imageBase64?: string | null,
  imageContentType?: string | null,
  defaultImage?: string
): string => {
  if (imageBase64 && imageContentType) {
    return `data:${imageContentType};base64,${imageBase64}`;
  }
  return defaultImage || '';
};

/**
 * Check if an image source is a base64 data URL
 * @param src The image source to check
 * @returns True if the source is a base64 data URL
 */
export const isBase64Image = (src: string): boolean => {
  return src.startsWith('data:');
};

/**
 * Validate image file type
 * @param file The file to validate
 * @param allowedTypes Allowed MIME types (defaults to common image types)
 * @returns True if the file type is allowed
 */
export const isValidImageType = (
  file: File,
  allowedTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ]
): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Validate image file size
 * @param file The file to validate
 * @param maxSizeInMB Maximum allowed size in megabytes (default: 5MB)
 * @returns True if the file size is within limit
 */
export const isValidImageSize = (
  file: File,
  maxSizeInMB: number = 5
): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

/**
 * Process an image file for upload
 * Validates type and size, then converts to base64
 * @param file The file to process
 * @param options Validation options
 * @returns Promise with base64 and content type, or throws error
 */
export const processImageForUpload = async (
  file: File,
  options: {
    allowedTypes?: string[];
    maxSizeInMB?: number;
  } = {}
): Promise<{ base64: string; contentType: string }> => {
  const { allowedTypes, maxSizeInMB = 5 } = options;

  if (!isValidImageType(file, allowedTypes)) {
    throw new Error('Invalid image type. Please use JPEG, PNG, GIF, or WebP.');
  }

  if (!isValidImageSize(file, maxSizeInMB)) {
    throw new Error(`Image size must be less than ${maxSizeInMB}MB.`);
  }

  return fileToBase64(file);
};
