// SEO utility functions for dynamic meta tag management
export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

// Update document title dynamically
export const updatePageTitle = (title: string, appendSiteName = true): void => {
  const siteName = 'AtYourDoorStep';
  document.title = appendSiteName ? `${title} | ${siteName}` : title;
};

// Update meta description
export const updateMetaDescription = (description: string): void => {
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  }
};

// Update meta keywords
export const updateMetaKeywords = (keywords: string): void => {
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute('content', keywords);
  }
};

// Update Open Graph meta tags
export const updateOGTags = (ogConfig: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}): void => {
  if (ogConfig.title) {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', ogConfig.title);
  }

  if (ogConfig.description) {
    const ogDescription = document.querySelector(
      'meta[property="og:description"]'
    );
    if (ogDescription)
      ogDescription.setAttribute('content', ogConfig.description);
  }

  if (ogConfig.image) {
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', ogConfig.image);
  }

  if (ogConfig.url) {
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', ogConfig.url);
  }
};

// Update canonical URL
export const updateCanonicalUrl = (url: string): void => {
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute('href', url);
  }
};

// Add structured data to page
export const addStructuredData = (data: object): void => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

// Generate product structured data
export const generateProductStructuredData = (product: {
  name: string;
  description: string;
  image: string;
  price?: string;
  currency?: string;
  availability?: string;
  category?: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    category: product.category || 'Food',
    brand: {
      '@type': 'Brand',
      name: 'AtYourDoorStep',
    },
    offers: {
      '@type': 'Offer',
      price: product.price || '0',
      priceCurrency: product.currency || 'INR',
      availability: product.availability || 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'AtYourDoorStep',
      },
    },
  };
};

// Comprehensive SEO optimization function
export const optimizeSEO = (config: SEOConfig): void => {
  if (config.title) {
    updatePageTitle(config.title);
  }

  if (config.description) {
    updateMetaDescription(config.description);
  }

  if (config.keywords) {
    updateMetaKeywords(config.keywords);
  }

  if (config.ogTitle || config.ogDescription || config.ogImage) {
    updateOGTags({
      title: config.ogTitle,
      description: config.ogDescription,
      image: config.ogImage,
    });
  }

  if (config.canonicalUrl) {
    updateCanonicalUrl(config.canonicalUrl);
  }

  if (config.structuredData) {
    addStructuredData(config.structuredData);
  }
};

// SEO configurations for different sections
export const seoConfigs = {
  home: {
    title:
      'Premium Alphonso Mangoes, Cold-Pressed Oils & Organic Jaggery Delivery',
    description:
      'Get authentic Ratnagiri Alphonso mangoes, pure cold-pressed oils, and organic jaggery delivered fresh to your doorstep. Premium quality natural products from trusted Indian farmers.',
    keywords:
      'Alphonso mangoes, Ratnagiri mangoes, cold-pressed oils, organic jaggery, doorstep delivery, premium natural products, Indian mangoes, pure oils, traditional jaggery, online grocery delivery',
  },
  about: {
    title: 'About AtYourDoorStep - From Ratnagiri Orchards to Your Home',
    description:
      'Learn about our journey bringing authentic Ratnagiri Alphonso mangoes, pure cold-pressed oils, and organic jaggery from traditional Indian farmers directly to your doorstep.',
    keywords:
      'AtYourDoorStep story, Ratnagiri farmers, authentic Indian products, natural food delivery, traditional farming, premium quality assurance',
  },
  services: {
    title: 'Our Premium Delivery Services - Fresh Natural Products',
    description:
      'Discover our premium doorstep delivery services for Alphonso mangoes, cold-pressed oils, and organic jaggery. Fast, reliable delivery of authentic natural products.',
    keywords:
      'doorstep delivery, premium food delivery, natural products delivery, Alphonso mango delivery, cold-pressed oil delivery, organic jaggery delivery',
  },
  contact: {
    title: 'Contact AtYourDoorStep - Order Premium Natural Products',
    description:
      'Get in touch with AtYourDoorStep to order authentic Ratnagiri Alphonso mangoes, pure cold-pressed oils, and organic jaggery. Premium quality guaranteed.',
    keywords:
      'contact AtYourDoorStep, order Alphonso mangoes, buy cold-pressed oils, organic jaggery order, premium natural products contact',
  },
};
