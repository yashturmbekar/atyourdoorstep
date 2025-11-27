import type { Product } from '../types';

export const PRODUCTS: Product[] = [
  // Alphonso Mango
  {
    id: 'alphonso-1',
    name: 'Premium Alphonso Mangoes',
    category: 'alphonso',
    description:
      'Fresh, premium quality Alphonso mangoes - the king of mangoes. Sweet, juicy, and aromatic.',
    image: '/images/mangoes-carousel.png',
    variants: [
      {
        id: 'alphonso-2dozen',
        size: '2 dozen',
        price: 1600,
        unit: 'kg',
        inStock: true,
      },
    ],
  },

  // Sun Product - Premium Alphonso Mangoes
  {
    id: 'alphonso-sun-1',
    name: 'Sun Product - Premium Alphonso Mangoes',
    category: 'alphonso',
    description:
      'Premium sun-ripened Alphonso mangoes with exceptional sweetness and flavor. Perfect for gifting and special occasions.',
    image: '/images/mangoes-carousel-1.png',
    variants: [
      {
        id: 'alphonso-sun-5dozen',
        size: '5 dozen',
        price: 4000,
        unit: 'kg',
        inStock: true,
      },
    ],
  },

  // Jaggery Products
  {
    id: 'jaggery-block',
    name: 'Organic Jaggery (Block)',
    category: 'jaggery',
    description:
      'Traditional pure organic jaggery blocks (kolhapuri gul/gud) made from sugarcane. Natural sweetener with rich minerals.',
    image: '/images/jaggery-carousel.png',
    variants: [
      {
        id: 'jaggery-block-1kg',
        size: '1 kg',
        price: 80,
        unit: 'kg',
        inStock: true,
      },
    ],
  },
  {
    id: 'jaggery-powder',
    name: 'Organic Jaggery (Powder)',
    category: 'jaggery',
    description:
      'Fine organic jaggery powder for easy cooking and baking. Perfect for tea, desserts and daily use.',
    image: '/images/jaggery-powder-carousel.png',
    variants: [
      {
        id: 'jaggery-powder-500g',
        size: '500 g',
        price: 150,
        unit: 'g',
        inStock: true,
      },
      {
        id: 'jaggery-powder-1kg',
        size: '1 kg',
        price: 280,
        unit: 'kg',
        inStock: true,
      },
    ],
  },

  // Oil Products
  {
    id: 'sunflower-oil',
    name: 'Cold Pressed Sunflower Oil',
    category: 'oil',
    description:
      'Pure cold-pressed sunflower oil. Rich in Vitamin E and perfect for cooking.',
    image: '/images/cold-pressed-oil-carousel.png',
    variants: [
      {
        id: 'sunflower-1l',
        size: '1 L',
        price: 320,
        unit: 'L',
        inStock: true,
      },
      {
        id: 'sunflower-2l',
        size: '2 L',
        price: 620,
        unit: 'L',
        inStock: true,
      },
      {
        id: 'sunflower-5l',
        size: '5 L',
        price: 1500,
        unit: 'L',
        inStock: true,
      },
    ],
  },
  {
    id: 'groundnut-oil',
    name: 'Cold Pressed Groundnut Oil',
    category: 'oil',
    description:
      'Pure cold-pressed groundnut (peanut) oil. Traditional method of extraction preserves nutrients.',
    image: '/images/cold-pressed-oil-carousel.png',
    variants: [
      {
        id: 'groundnut-1l',
        size: '1 L',
        price: 380,
        unit: 'L',
        inStock: true,
      },
      {
        id: 'groundnut-2l',
        size: '2 L',
        price: 740,
        unit: 'L',
        inStock: true,
      },
      {
        id: 'groundnut-5l',
        size: '5 L',
        price: 1800,
        unit: 'L',
        inStock: true,
      },
    ],
  },
  {
    id: 'sesame-oil',
    name: 'Cold Pressed Sesame Oil',
    category: 'oil',
    description:
      'Pure cold-pressed sesame oil. Perfect for cooking and ayurvedic treatments.',
    image: '/images/cold-pressed-oil-carousel.png',
    variants: [
      {
        id: 'sesame-200ml',
        size: '200 ml',
        price: 120,
        unit: 'ml',
        inStock: true,
      },
      {
        id: 'sesame-500ml',
        size: '500 ml',
        price: 250,
        unit: 'ml',
        inStock: true,
      },
      {
        id: 'sesame-1l',
        size: '1 L',
        price: 480,
        unit: 'L',
        inStock: true,
      },
    ],
  },
  {
    id: 'almond-oil',
    name: 'Cold Pressed Almond Oil',
    category: 'oil',
    description:
      'Premium cold-pressed almond oil. Perfect for baby care and skin care.',
    image: '/images/cold-pressed-oil-carousel.png',
    variants: [
      {
        id: 'almond-50ml',
        size: '50 ml',
        price: 300,
        unit: 'ml',
        inStock: true,
      },
      {
        id: 'almond-100ml',
        size: '100 ml',
        price: 600,
        unit: 'ml',
        inStock: true,
      },
      {
        id: 'almond-200ml',
        size: '200 ml',
        price: 600,
        unit: 'ml',
        inStock: true,
      },
      {
        id: 'almond-500ml',
        size: '500 ml',
        price: 800,
        unit: 'ml',
        inStock: true,
      },
    ],
  },
  {
    id: 'mustard-oil',
    name: 'Cold Pressed Mustard Oil',
    category: 'oil',
    description:
      'Pure cold-pressed mustard oil. Traditional cooking oil with strong flavor, perfect for Indian cuisine.',
    image: '/images/cold-pressed-oil-carousel.png',
    variants: [
      {
        id: 'mustard-500ml',
        size: '500 ml',
        price: 180,
        unit: 'ml',
        inStock: true,
      },
      {
        id: 'mustard-1l',
        size: '1 L',
        price: 340,
        unit: 'L',
        inStock: true,
      },
      {
        id: 'mustard-2l',
        size: '2 L',
        price: 660,
        unit: 'L',
        inStock: true,
      },
      {
        id: 'mustard-5l',
        size: '5 L',
        price: 1600,
        unit: 'L',
        inStock: true,
      },
    ],
  },
  {
    id: 'coconut-oil',
    name: 'Cold Pressed Coconut Oil',
    category: 'oil',
    description:
      'Premium cold-pressed virgin coconut oil. Perfect for cooking, hair care, and skin care.',
    image: '/images/cold-pressed-oil-carousel.png',
    variants: [
      {
        id: 'coconut-200ml',
        size: '200 ml',
        price: 220,
        unit: 'ml',
        inStock: true,
      },
      {
        id: 'coconut-500ml',
        size: '500 ml',
        price: 480,
        unit: 'ml',
        inStock: true,
      },
      {
        id: 'coconut-1l',
        size: '1 L',
        price: 920,
        unit: 'L',
        inStock: true,
      },
      {
        id: 'coconut-2l',
        size: '2 L',
        price: 1800,
        unit: 'L',
        inStock: true,
      },
    ],
  },
];

export const PRODUCT_CATEGORIES = [
  { id: 'all', name: 'All Products', icon: '🛍️' },
  { id: 'alphonso', name: 'Alphonso Mangoes', icon: '🥭' },
  { id: 'jaggery', name: 'Jaggery Products', icon: '🍯' },
  { id: 'oil', name: 'Cold Pressed Oils', icon: '🛢️' },
];

export const DELIVERY_CHARGES = {
  freeDeliveryThreshold: 1000,
  standardCharge: 50,
  expressCharge: 100,
};
