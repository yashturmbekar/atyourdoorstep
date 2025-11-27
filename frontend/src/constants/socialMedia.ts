// Social Media Links and Configuration
export const SOCIAL_MEDIA_LINKS = {
  facebook: 'https://www.facebook.com/profile.php?id=100074808451374',
  instagram: 'https://www.instagram.com/gopro.baba/',
  twitter: 'https://x.com/goprobaba',
  linkedin: 'https://www.linkedin.com/in/yashturmbekar',
} as const;

// Social Media Platform Names
export const SOCIAL_MEDIA_NAMES = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'X (Twitter)',
  linkedin: 'LinkedIn',
} as const;

// Social Media Usernames/Handles
export const SOCIAL_MEDIA_HANDLES = {
  facebook: 'AtYourDoorStep',
  instagram: '@gopro.baba',
  twitter: '@goprobaba',
  linkedin: 'Yash Turmbekar',
} as const;

// For structured data (Schema.org)
export const SOCIAL_MEDIA_SCHEMA_ARRAY = [
  SOCIAL_MEDIA_LINKS.facebook,
  SOCIAL_MEDIA_LINKS.instagram,
  SOCIAL_MEDIA_LINKS.twitter,
  SOCIAL_MEDIA_LINKS.linkedin,
];

// Social Media Meta Tags Configuration
export const SOCIAL_MEDIA_META_CONFIG = {
  // Open Graph (Facebook)
  og: {
    site_name: 'AtYourDoorStep',
    locale: 'en_IN',
    type: 'website',
  },
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@goprobaba',
    creator: '@goprobaba',
  },
};

// Social Media Sharing URLs
export const getSocialShareUrls = (url: string, text: string) => ({
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}&via=goprobaba`,
  linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
});

// Social Media Icons (SVG paths for reusability)
export const SOCIAL_MEDIA_ICONS = {
  facebook: {
    viewBox: '0 0 24 24',
    path: 'M18.77 7.46H15.5v-1.9c0-.9.6-1.1 1-1.1h2.2v-3.4l-3-.01C13.24 1 12.2 2.1 12.2 4v3.46h-2.3v3.5h2.3V19h3.3v-8.04h2.8l.47-3.5z',
  },
  instagram: {
    viewBox: '0 0 24 24',
    paths: [
      'M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61992 14.1902 8.22773 13.4229 8.09407 12.5922C7.9604 11.7615 8.09207 10.9099 8.47033 10.1584C8.84859 9.40685 9.45418 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87658 12.63 8C13.4789 8.12588 14.2649 8.52146 14.8717 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z',
      'M17.5 6.5H17.51',
    ],
    rect: 'M2 2L22 2Q22 2 22 22L2 22Q2 2 2 2Z',
  },
  twitter: {
    viewBox: '0 0 24 24',
    path: 'M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12393C16.6767 2.90116 15.7395 2.95718 14.8821 3.28445C14.0247 3.61173 13.2884 4.19445 12.773 4.95371C12.2575 5.71297 11.9877 6.61234 12 7.53V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39624C5.36074 6.60667 4.01032 5.43666 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.5C20.9991 7.22145 20.9723 6.94359 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3V3Z',
  },
  linkedin: {
    viewBox: '0 0 24 24',
    paths: [
      'M16 8C18.5 8 20.5 10 20.5 12.5V21H17V12.5C17 11.5 16 10.5 15 10.5S13 11.5 13 12.5V21H9.5V8H13V9.5C13.5 8.5 14.5 8 16 8Z',
      'M2 9H5.5V21H2V9ZM3.75 2C4.99264 2 6 3.00736 6 4.25C6 5.49264 4.99264 6.5 3.75 6.5C2.50736 6.5 1.5 5.49264 1.5 4.25C1.5 3.00736 2.50736 2 3.75 2Z',
    ],
  },
};
