# Customization Guide

Learn how to customize the AtYourDoorStep website to match your brand and requirements.

## 🎨 Brand Customization

### Colors and Theme

The website uses a product-inspired color scheme. To customize:

#### 1. Primary Brand Colors

Edit `src/styles/globals.css`:

```css
:root {
  /* Primary Colors - Mango Orange Theme */
  --primary-color: #ff6b35;
  --primary-dark: #e55a2b;
  --primary-light: #ff8a5a;

  /* Secondary Colors - Natural Green */
  --secondary-color: #228b22;
  --secondary-dark: #1f7a1f;
  --secondary-light: #32cd32;

  /* Accent Colors - Jaggery Brown */
  --accent-color: #8b4513;
  --accent-dark: #7a3f12;
  --accent-light: #cd853f;

  /* Neutral Colors */
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --background: #ffffff;
  --background-secondary: #f9fafb;
}
```

#### 2. Product-Specific Themes

Each product has its own color theme in `src/components/common/Hero/Hero.tsx`:

```typescript
const products = [
  {
    name: 'Alphonso Mangoes',
    gradientColors: ['#FF6B35', '#FFAA00', '#FFE135'],
    // ... other properties
  },
  {
    name: 'Cold-Pressed Oils',
    gradientColors: ['#228B22', '#32CD32', '#90EE90'],
    // ... other properties
  },
  {
    name: 'Organic Jaggery',
    gradientColors: ['#8B4513', '#CD853F', '#DEB887'],
    // ... other properties
  },
];
```

### Typography

#### Font Family

To change the primary font, update `src/styles/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

body {
  font-family: 'Inter', 'Your-Font', sans-serif;
}
```

#### Font Sizes and Weights

```css
:root {
  /* Font Sizes */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;

  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
}
```

## 📝 Content Customization

### Product Information

#### 1. Hero Section Products

Edit `src/components/common/Hero/Hero.tsx`:

```typescript
const products = useMemo(
  () => [
    {
      id: 1,
      name: 'Your Product Name',
      description: 'Your product description...',
      emoji: '🥭', // Product emoji
      image: '/images/your-product-image.png',
      imageAlt: 'Alt text for your product',
      highlight: 'Your Key Selling Point',
      features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
      gradientColors: ['#color1', '#color2', '#color3'],
    },
    // Add more products...
  ],
  []
);
```

#### 2. Services Section

Edit `src/components/common/Services/Services.tsx`:

```typescript
const services = [
  {
    id: 1,
    name: 'Service Name',
    description: 'Service description...',
    features: ['Feature 1', 'Feature 2'],
    // ... other properties
  },
];
```

### About Section

Edit `src/components/common/About/About.tsx`:

```typescript
// Update company story and values
const aboutContent = {
  story: 'Your company story...',
  mission: 'Your mission statement...',
  values: ['Value 1', 'Value 2', 'Value 3'],
};
```

### Contact Information

Update contact details in `src/components/common/Contact/Contact.tsx` and `src/components/common/Footer/Footer.tsx`:

```typescript
const contactInfo = {
  email: 'your-email@company.com',
  phone: '+1-234-567-8900',
  address: 'Your Business Address',
  businessHours: 'Mon-Fri 9AM-6PM',
};
```

## 🖼️ Image Customization

### Product Images

1. **Replace Images**: Add your images to `public/images/`
2. **Naming Convention**: Use descriptive names like `product-name-hero.png`
3. **Optimization**: Compress images for web (< 500KB recommended)
4. **Formats**: Use PNG for logos, JPG for photos, WebP for modern browsers

#### Required Images

```
public/images/
├── AtYourDoorStep.png           # Main logo (192x192, 512x512)
├── your-product-1-carousel.png  # Hero carousel image
├── your-product-2-carousel.png  # Hero carousel image
├── your-product-3-carousel.png  # Hero carousel image
└── favicon.ico                  # Browser favicon
```

### Logo Customization

Update logo in multiple places:

1. **Main Logo**: `public/images/AtYourDoorStep.png`
2. **Favicon**: `public/favicon.ico`
3. **Manifest**: Update `public/manifest.json` icon references

## 📱 Social Media Integration

### Update Social Media Links

Edit `src/constants/socialMedia.ts`:

```typescript
export const SOCIAL_MEDIA_LINKS = {
  facebook: 'https://facebook.com/your-page',
  instagram: 'https://instagram.com/your-account',
  twitter: 'https://twitter.com/your-account',
  linkedin: 'https://linkedin.com/company/your-company',
} as const;
```

### Social Media Meta Tags

Update `index.html` with your social media information:

```html
<!-- Open Graph -->
<meta property="og:title" content="Your Business Name" />
<meta property="og:description" content="Your business description" />
<meta
  property="og:image"
  content="https://yourdomain.com/images/og-image.png"
/>

<!-- Twitter Cards -->
<meta property="twitter:title" content="Your Business Name" />
<meta property="twitter:description" content="Your business description" />
```

## 🔍 SEO Customization

### Business Information

Update structured data in `index.html`:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Business Name",
  "url": "https://yourdomain.com",
  "logo": "https://yourdomain.com/images/logo.png",
  "description": "Your business description",
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "Your State",
    "addressCountry": "Your Country"
  }
}
```

### Keywords and Meta Tags

Edit SEO configurations in `src/utils/seo.ts`:

```typescript
export const seoConfigs = {
  home: {
    title: 'Your Business - Your Key Products',
    description: 'Your business description with keywords...',
    keywords: 'your, main, keywords, here',
  },
  // ... other page configs
};
```

### Sitemap and Robots

1. **Update Domain**: Replace URLs in `public/sitemap.xml`
2. **Robots.txt**: Update `public/robots.txt` with your domain

## 🎭 Component Customization

### Creating New Components

1. **Create Component Folder**:

```
src/components/common/YourComponent/
├── YourComponent.tsx
├── YourComponent.css
└── index.ts
```

2. **Component Template**:

```typescript
import './YourComponent.css';

interface YourComponentProps {
  title?: string;
  // Add your props
}

export const YourComponent = ({ title }: YourComponentProps) => {
  return (
    <section className="your-component">
      <div className="container">
        <h2>{title}</h2>
        {/* Your component content */}
      </div>
    </section>
  );
};
```

3. **Add to Homepage**:

```typescript
// In src/pages/HomePage.tsx
import { YourComponent } from '../components/common';

export const HomePage = () => {
  return (
    <div className="homepage">
      {/* ... other components */}
      <YourComponent title="Your Section Title" />
    </div>
  );
};
```

## 🌐 Localization

### Adding Multiple Languages

1. **Install i18n Library**:

```bash
npm install react-i18next i18next
```

2. **Create Language Files**:

```
src/locales/
├── en/
│   └── common.json
├── hi/
│   └── common.json
└── index.ts
```

3. **Configure i18n**:

```typescript
// src/locales/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: { common: require('./en/common.json') },
    hi: { common: require('./hi/common.json') },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});
```

## 🔧 Advanced Customization

### Performance Optimization

1. **Image Lazy Loading**:

```typescript
// Add to components
const [imageLoaded, setImageLoaded] = useState(false);

<img
  src={product.image}
  alt={product.imageAlt}
  loading="lazy"
  onLoad={() => setImageLoaded(true)}
  className={imageLoaded ? 'loaded' : 'loading'}
/>
```

2. **Bundle Analysis**:

```bash
# Install analyzer
npm install --save-dev rollup-plugin-analyzer

# Add to vite.config.ts
import { defineConfig } from 'vite';
import analyze from 'rollup-plugin-analyzer';

export default defineConfig({
  plugins: [
    // ... other plugins
    analyze()
  ]
});
```

### Animation Customization

Edit CSS animations in component files:

```css
/* Custom animation example */
@keyframes yourCustomAnimation {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.your-element {
  animation: yourCustomAnimation 0.6s ease-out;
}
```

## 📋 Customization Checklist

### Basic Customization

- [ ] Update brand colors in CSS variables
- [ ] Replace product images
- [ ] Update company logo and favicon
- [ ] Modify product information in Hero component
- [ ] Update contact information
- [ ] Configure social media links

### Advanced Customization

- [ ] Add new product categories
- [ ] Implement additional pages
- [ ] Set up analytics tracking
- [ ] Configure email marketing integration
- [ ] Add payment processing
- [ ] Implement user accounts

### SEO & Marketing

- [ ] Update all meta tags with business info
- [ ] Configure Google Analytics
- [ ] Set up Google Search Console
- [ ] Verify social media business accounts
- [ ] Create content marketing strategy

## 🆘 Need Help?

- **Documentation**: Check other guides in `/docs`
- **Issues**: Create detailed GitHub issue
- **Developer Support**: [Yash Turmbekar](https://www.linkedin.com/in/yashturmbekar)
- **Business Support**: info@atyourdoorstep.shop

---

_Remember to test all customizations across different devices and browsers before deploying to production._
