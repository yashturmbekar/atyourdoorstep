# AtYourDoorStep Web Application

A modern React + TypeScript + Vite application for premium natural products doorstep delivery services.

## ✨ Features

- ⚡️ **Vite** - Fast build tool and development server
- ⚛️ **React 18** - Latest version with concurrent features
- 🟦 **TypeScript** - Full type safety
- 🎨 **Global Theme System** - CSS custom properties with TypeScript integration
- 📁 **Organized Structure** - Clean and scalable project organization
- � **Modern UI** - Responsive design with theme-driven components
- 🔧 **Custom Hooks** - Reusable logic with custom React hooks
- 🌐 **API Service** - Structured API communication layer
- 📱 **Mobile First** - Fully responsive design
- 🔍 **SEO Optimized** - Complete SEO implementation

## 🎨 Theme System

This project features a comprehensive global theme system:

- **CSS Custom Properties** - All components use theme variables
- **TypeScript Integration** - Type-safe theme configuration
- **Global Control** - Change entire design from single config file
- **Easy Customization** - Simple theme switching and modification

```tsx
// Change primary color across all components
updateTheme({
  colors: { ...theme.colors, primary: '#22c55e' },
});
```

## 🏗️ Project Structure

```
frontend/
├── 📁 public/                    # Static assets
│   ├── manifest.json            # PWA manifest
│   ├── robots.txt               # SEO robots file
│   ├── sitemap.xml              # SEO sitemap
│   └── images/                  # Public images
│       ├── AtYourDoorStep.png
│       ├── cold-pressed-oil-carousel-1.png
│       ├── cold-pressed-oil-carousel.png
│       ├── jaggery-carousel-1.png
│       ├── jaggery-carousel.png
│       ├── jaggery-powder-carousel.png
│       ├── mangoes-carousel-1.png
│       ├── mangoes-carousel.png
│       ├── Ourproduct.png
│       ├── Ourspace.png
│       └── ourstory.png
├── 📁 src/                      # Source code
│   ├── 📁 components/           # React components
│   │   ├── Accordion.js         # Accordion component
│   │   ├── index.ts             # Component exports
│   │   ├── 📁 admin/            # Admin dashboard components
│   │   │   ├── index.ts
│   │   │   ├── AdminDashboard/
│   │   │   ├── AdminLayout/
│   │   │   ├── AdminLogin/
│   │   │   ├── Analytics/
│   │   │   ├── CustomerManagement/
│   │   │   ├── OrderManagement/
│   │   │   ├── ProductForm/
│   │   │   ├── ProductManagement/
│   │   │   └── Settings/
│   │   ├── 📁 common/           # Common UI components
│   │   │   ├── index.ts
│   │   │   ├── About/           # About section
│   │   │   ├── Button/          # Button component
│   │   │   ├── Card/            # Card component
│   │   │   ├── Cart/            # Shopping cart
│   │   │   ├── CategoryProductCatalog/
│   │   │   ├── Checkout/        # Checkout flow
│   │   │   ├── Contact/         # Contact form
│   │   │   ├── Footer/          # Footer component
│   │   │   ├── Header/          # Header/Navigation
│   │   │   ├── Hero/            # Hero section
│   │   │   ├── Loader/          # Loading spinner
│   │   │   ├── OrderTracker/    # Order tracking
│   │   │   ├── PageLayout/      # Page layout wrapper
│   │   │   ├── ProductCard/     # Product card
│   │   │   ├── ScrollToTop/     # Scroll to top button
│   │   │   ├── Section/         # Section wrapper
│   │   │   ├── Services/        # Services section
│   │   │   ├── SocialShare/     # Social sharing
│   │   │   ├── Testimonials/    # Customer testimonials
│   │   │   └── WhyChooseUs/     # Why choose us section
│   │   └── 📁 ThemeDemo/        # Theme demo components
│   ├── 📁 contexts/             # React contexts
│   │   ├── AdminAuthContext.tsx # Admin authentication
│   │   ├── CartContext.tsx      # Shopping cart state
│   │   └── ThemeContext.tsx     # Theme management
│   ├── 📁 hooks/                # Custom React hooks
│   │   ├── index.ts
│   │   ├── useAdminAuth.ts      # Admin auth hook
│   │   ├── useCart.ts           # Cart management hook
│   │   ├── useSEO.ts            # SEO utilities hook
│   │   ├── useTheme.ts          # Theme hook
│   │   └── useThemeContext.ts   # Theme context hook
│   ├── 📁 pages/                # Page components
│   │   ├── index.ts
│   │   ├── AdminAnalyticsPage.tsx
│   │   ├── AdminCustomersPage.tsx
│   │   ├── AdminDashboardPage.tsx
│   │   ├── AdminLoginPage.tsx
│   │   ├── AdminOrdersPage.tsx
│   │   ├── AdminProductEditPage.tsx
│   │   ├── AdminProductFormPage.tsx
│   │   ├── AdminProductsPage.tsx
│   │   ├── AdminSettingsPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── OrderPage.css
│   │   ├── OrderPage.tsx
│   │   └── ThemeDemoPage.tsx
│   ├── 📁 services/             # API and external services
│   │   ├── index.ts
│   │   ├── adminApi.ts          # Admin API calls
│   │   └── api.ts               # Main API service
│   ├── 📁 styles/               # Global styles
│   │   ├── animations.css       # Animation styles
│   │   ├── App.css             # App styles
│   │   ├── base.css            # Base styles
│   │   ├── globals.css         # Global styles
│   │   ├── index.css           # Entry styles
│   │   ├── theme-utilities.css # Theme utility classes
│   │   └── theme.css           # Theme styles
│   ├── 📁 theme/               # Theme system
│   │   ├── index.ts
│   │   └── theme.config.ts     # Theme configuration
│   ├── 📁 types/               # TypeScript types
│   │   └── index.ts
│   ├── 📁 utils/               # Utility functions
│   │   ├── index.ts
│   │   └── seo.ts              # SEO utilities
│   ├── 📁 constants/           # Application constants
│   │   ├── index.ts
│   │   ├── products.ts         # Product constants
│   │   └── socialMedia.ts      # Social media constants
│   ├── 📁 assets/              # Static assets
│   ├── App.css                 # Main app styles
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── vite-env.d.ts           # Vite environment types
├── 📁 docs/                     # Documentation
│   ├── 📁 guides/
│   │   ├── customization.md
│   │   ├── setup.md
│   │   ├── theme-implementation.md
│   │   ├── theme-integration-summary.md
│   │   └── website-overview.md
│   ├── 📁 seo/
│   │   ├── seo-optimization-guide.md
│   │   ├── seo-setup.md
│   │   └── social-media-seo.md
│   ├── 📁 technical/
│   │   ├── api.md
│   │   ├── component-organization.md
│   │   └── theme-system.md
│   └── 📁 assets/
│       └── images.md
├── 📄 Configuration files
│   ├── eslint.config.js         # ESLint configuration
│   ├── fix-theme-variables.js   # Theme variable fix script
│   ├── index.html              # HTML template
│   ├── package.json            # Dependencies and scripts
│   ├── tsconfig.app.json       # TypeScript app config
│   ├── tsconfig.json           # TypeScript config
│   ├── tsconfig.node.json      # TypeScript node config
│   └── vite.config.ts          # Vite configuration
└── 📄 Documentation files
    ├── BACKGROUND_THEMES.md     # Theme background info
    ├── FOOTER_FIX.md           # Footer fix documentation
    ├── HEADER_COLORS.md        # Header color documentation
    ├── README.md               # This file
    ├── TESTING_GUIDE.md        # Testing guide
    └── THEME_MIGRATION.md      # Theme migration guide
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run start` - Start development server (alias for dev)
- `npm run build` - Build for production (TypeScript check + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting with Prettier

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](docs/) folder:

### 🎨 Theme System

- [Theme System Documentation](docs/technical/theme-system.md) - Complete theme API reference
- [Theme Implementation Guide](docs/guides/theme-implementation.md) - Step-by-step implementation
- [Theme Integration Summary](docs/guides/theme-integration-summary.md) - Component integration details

### 🚀 Development

- [Setup Guide](docs/guides/setup.md) - Development environment setup
- [Website Overview](docs/guides/website-overview.md) - Project features and structure
- [Customization Guide](docs/guides/customization.md) - How to customize components

### 🔍 SEO & Marketing

- [SEO Setup](docs/seo/seo-setup.md) - Search engine optimization
- [SEO Optimization Guide](docs/seo/seo-optimization-guide.md) - Advanced SEO techniques
- [Social Media SEO](docs/seo/social-media-seo.md) - Social media optimization

### 🛠️ Technical

- [Theme System](docs/technical/theme-system.md) - Complete theme system API reference
- [Component Organization](docs/technical/component-organization.md) - Component structure
- [API Documentation](docs/technical/api.md) - API endpoints and usage

### 📊 Assets

- [Image Guidelines](docs/assets/images.md) - Image optimization and management

### 🎯 Quick Reference

| Category            | Document                                            | Description                  |
| ------------------- | --------------------------------------------------- | ---------------------------- |
| **Getting Started** | [Website Overview](docs/guides/website-overview.md) | Complete project overview    |
| **Theme System**    | [Theme System](docs/technical/theme-system.md)      | Complete theme documentation |
| **Development**     | [Setup Guide](docs/guides/setup.md)                 | Development setup            |
| **SEO**             | [SEO Setup](docs/seo/seo-setup.md)                  | SEO configuration            |
| **Customization**   | [Customization Guide](docs/guides/customization.md) | Component customization      |

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=AtYourDoorStep
VITE_APP_VERSION=1.0.0
```

## 🔧 Key Components & Features

### 🎯 Core Components

#### Admin Dashboard

- **AdminDashboard** - Main admin interface
- **AdminLayout** - Admin page layout wrapper
- **AdminLogin** - Admin authentication
- **Analytics** - Business analytics and reporting
- **CustomerManagement** - Customer data management
- **OrderManagement** - Order processing and tracking
- **ProductForm** - Product creation and editing
- **ProductManagement** - Product catalog management
- **Settings** - Admin configuration settings

#### Common UI Components

- **Button** - Configurable button component with variants
- **Card** - Reusable card component
- **Cart** - Shopping cart functionality
- **Checkout** - Payment and order completion
- **Header/Footer** - Site navigation and footer
- **Hero** - Landing page hero section
- **Loader** - Loading states and spinners
- **ProductCard** - Product display component
- **Testimonials** - Customer reviews and testimonials
- **Services** - Service offerings display
- **WhyChooseUs** - Value proposition section

### 🔗 State Management

#### Contexts

- **AdminAuthContext** - Admin authentication state
- **CartContext** - Shopping cart state management
- **ThemeContext** - Global theme state and switching

#### Custom Hooks

- **useAdminAuth** - Admin authentication logic
- **useCart** - Cart operations and state
- **useSEO** - SEO utilities and meta management
- **useTheme** - Theme switching and configuration
- **useThemeContext** - Theme context consumption

### 📱 Page Components

- **HomePage** - Main landing page
- **OrderPage** - Order placement and tracking
- **ThemeDemoPage** - Theme system demonstration
- **Admin Pages** - Complete admin dashboard suite

### 🌐 API & Services

- **api.ts** - Main API service layer
- **adminApi.ts** - Admin-specific API calls
- Centralized error handling and response typing
- RESTful methods (GET, POST, PUT, DELETE)

### 🎨 Theme System Features

- **CSS Custom Properties** - All components use theme variables
- **TypeScript Integration** - Type-safe theme configuration
- **Global Control** - Change entire design from single config file
- **Easy Customization** - Simple theme switching and modification
- **Theme Utilities** - Utility classes for consistent styling

## Key Features Implemented

### 🎯 Type Safety

- Comprehensive TypeScript interfaces
- Strongly typed API responses
- Type-safe component props

### 🔧 Custom Hooks

- `useLocalStorage` - Persistent local storage management
- `useApi` - Simplified API data fetching

### 🌐 API Service Layer

- Centralized API communication
- Error handling and response typing
- RESTful methods (GET, POST, PUT, DELETE)

### 🎨 Reusable Components

- `Button` - Configurable button component with variants
- `Loader` - Loading spinner component
- Extensible component architecture

## Development Guidelines

### Code Organization

- Keep components small and focused
- Use TypeScript interfaces for all props and data structures
- Implement proper error handling in API calls
- Follow the established folder structure

### Styling

- Use utility-first CSS approach
- Keep component-specific styles in separate files
- Maintain consistent naming conventions

### Best Practices

- Always type your components and functions
- Use custom hooks for reusable logic
- Implement proper loading and error states
- Write descriptive commit messages

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🛠️ Tech Stack

### Frontend

- **React** - 19.1.0 (Latest version with concurrent features)
- **TypeScript** - 5.8.3 (Full type safety)
- **Vite** - 6.3.5 (Fast build tool and development server)
- **React Router DOM** - 7.6.3 (Client-side routing)
- **React Icons** - 5.5.0 (Icon library)

### Development Tools

- **ESLint** - 9.25.0 (Code linting)
- **Prettier** - 3.6.0 (Code formatting)
- **TypeScript ESLint** - 8.30.1 (TypeScript linting)
- **Vite React Plugin** - 4.4.1 (React support for Vite)

### Styling & Theme

- **CSS3** - Custom properties and modern techniques
- **Global Theme System** - CSS custom properties with TypeScript integration
- **Responsive Design** - Mobile-first approach

### SEO & Performance

- **SEO Optimization** - Comprehensive implementation with structured data
- **Social Media Integration** - Professional business integration
- **Performance Optimization** - Fast loading with Vite and optimized assets

### Build & Development

- **Package Manager** - npm
- **Build Tool** - Vite with TypeScript compilation
- **Hot Module Replacement** - Development server with instant updates
- **TypeScript** - Strict mode enabled

## ✨ Features

- 🎨 **Modern Design** - Clean, professional layout with smooth animations
- 📱 **Fully Responsive** - Works perfectly on all devices and screen sizes
- ⚡ **Performance Optimized** - Fast loading with Vite and optimized assets
- 🔍 **SEO Ready** - Complete SEO implementation with structured data
- 🌐 **Social Media Integration** - Professional social media linking
- 📊 **Analytics Ready** - Prepared for Google Analytics and tracking
- 🛡️ **Type Safe** - Full TypeScript implementation with strict mode
- ♿ **Accessible** - WCAG compliant with proper ARIA labels

## 🚀 Roadmap

### Phase 1 (Immediate - 1-2 weeks)

- [ ] **Analytics Integration**: Google Analytics 4 and Search Console
- [ ] **Social Media Verification**: Business verification on all platforms
- [ ] **Content Updates**: Regular blog posts and seasonal content
- [ ] **Customer Reviews**: Implement review system with Schema markup

### Phase 2 (Short-term - 1-3 months)

- [ ] **E-commerce Integration**: Online ordering and payment processing
- [ ] **Inventory Management**: Stock tracking and availability updates
- [ ] **User Accounts**: Customer profiles and order history
- [ ] **Advanced SEO**: Local SEO optimization and keyword expansion

### Phase 3 (Long-term - 3-6 months)

- [ ] **Mobile App**: Native mobile application
- [ ] **Multi-language**: Hindi and regional language support
- [ ] **Subscription Service**: Regular delivery subscriptions
- [ ] **Influencer Platform**: Partnership and affiliate program

### Technical Improvements

- [ ] **Image Optimization**: WebP format and lazy loading
- [ ] **PWA Features**: Offline functionality and push notifications
- [ ] **Performance**: Further Core Web Vitals optimization
- [ ] **Accessibility**: WCAG 2.1 AA compliance

## 📞 Contact & Support

### Business Contact

- **Website**: https://atyourdoorstep.shop
- **Business Email**: info@atyourdoorstep.shop
- **Customer Support**: support@atyourdoorstep.shop

### Social Media

- **Facebook**: [AtYourDoorStep Business](https://www.facebook.com/profile.php?id=100074808451374)
- **Instagram**: [@gopro.baba](https://www.instagram.com/gopro.baba/)
- **X (Twitter)**: [@goprobaba](https://x.com/goprobaba)
- **LinkedIn**: [Yash Turmbekar](https://www.linkedin.com/in/yashturmbekar)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with passion for authentic Indian natural products and modern web standards** 🥭🫒🍯

_Last Updated: July 8, 2025_
