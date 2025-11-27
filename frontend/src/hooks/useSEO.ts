import { useEffect } from 'react';
import { type SEOConfig, optimizeSEO } from '../utils/seo';

/**
 * Custom hook for managing SEO meta tags
 * @param config - SEO configuration object
 */
export const useSEO = (config: SEOConfig) => {
  useEffect(() => {
    // Apply SEO optimizations
    optimizeSEO(config);

    // Cleanup function to reset to default values when component unmounts
    return () => {
      // Reset to default values
      if (config.title) {
        document.title = 'AtYourDoorStep - Premium Natural Products Delivery';
      }
    };
  }, [config]);
};

/**
 * Hook for setting page-specific structured data
 * @param structuredData - Schema.org structured data object
 * @param id - Unique identifier for the script tag
 */
export const useStructuredData = (
  structuredData: object,
  id: string = 'structured-data'
) => {
  useEffect(() => {
    // Remove existing structured data script with the same ID
    const existingScript = document.querySelector(
      `script[data-structured-data="${id}"]`
    );
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-structured-data', id);
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scriptToRemove = document.querySelector(
        `script[data-structured-data="${id}"]`
      );
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [structuredData, id]);
};

/**
 * Hook for updating page meta information based on current route/section
 * @param section - Current section/page identifier
 */
export const usePageMeta = (section: string) => {
  useEffect(() => {
    // Update meta tags based on current section
    const metaConfigs: Record<string, SEOConfig> = {
      home: {
        title:
          'Premium Alphonso Mangoes, Cold-Pressed Oils & Organic Jaggery Delivery',
        description:
          'Get authentic Ratnagiri Alphonso mangoes, pure cold-pressed oils, and organic jaggery delivered fresh to your doorstep. Premium quality natural products from trusted Indian farmers.',
        keywords:
          'Alphonso mangoes, Ratnagiri mangoes, cold-pressed oils, organic jaggery, doorstep delivery, premium natural products',
        canonicalUrl: 'https://atyourdoorstep.shop/',
      },
      about: {
        title: 'About AtYourDoorStep - From Ratnagiri Orchards to Your Home',
        description:
          'Learn about our journey bringing authentic Ratnagiri Alphonso mangoes, pure cold-pressed oils, and organic jaggery from traditional Indian farmers directly to your doorstep.',
        keywords:
          'AtYourDoorStep story, Ratnagiri farmers, authentic Indian products, natural food delivery',
        canonicalUrl: 'https://atyourdoorstep.shop/#about',
      },
      services: {
        title: 'Our Premium Delivery Services - Fresh Natural Products',
        description:
          'Discover our premium doorstep delivery services for Alphonso mangoes, cold-pressed oils, and organic jaggery. Fast, reliable delivery of authentic natural products.',
        keywords:
          'doorstep delivery, premium food delivery, natural products delivery, Alphonso mango delivery',
        canonicalUrl: 'https://atyourdoorstep.shop/#services',
      },
      contact: {
        title: 'Contact AtYourDoorStep - Order Premium Natural Products',
        description:
          'Get in touch with AtYourDoorStep to order authentic Ratnagiri Alphonso mangoes, pure cold-pressed oils, and organic jaggery. Premium quality guaranteed.',
        keywords:
          'contact AtYourDoorStep, order Alphonso mangoes, buy cold-pressed oils, organic jaggery order',
        canonicalUrl: 'https://atyourdoorstep.shop/#contact',
      },
    };

    const config = metaConfigs[section] || metaConfigs.home;
    optimizeSEO(config);
  }, [section]);
};
