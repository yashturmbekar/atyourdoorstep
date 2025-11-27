# Setup Guide

Complete setup instructions for the AtYourDoorStep website.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher (comes with Node.js)
- **Git**: For version control
- **VS Code**: Recommended code editor

## Installation Steps

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Development
VITE_APP_NAME=AtYourDoorStep
VITE_APP_VERSION=1.0.0

# API Configuration (if needed)
VITE_API_BASE_URL=http://localhost:3000/api

# Analytics (add when ready)
VITE_GA_TRACKING_ID=your-ga-tracking-id
VITE_FACEBOOK_PIXEL_ID=your-pixel-id
```

### 3. Development Server

```bash
# Start development server
npm run dev

# Server will start at http://localhost:5173
```

### 4. Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Available Scripts

| Command              | Description               |
| -------------------- | ------------------------- |
| `npm run dev`        | Start development server  |
| `npm run build`      | Build for production      |
| `npm run preview`    | Preview production build  |
| `npm run lint`       | Run ESLint                |
| `npm run lint:fix`   | Fix ESLint errors         |
| `npm run format`     | Format code with Prettier |
| `npm run type-check` | Run TypeScript checks     |

## Project Structure

```
frontend/
├── docs/                    # 📚 All documentation
│   ├── guides/             # User guides
│   ├── seo/               # SEO documentation
│   ├── technical/         # Technical docs
│   └── assets/            # Asset guidelines
├── public/                 # Static assets
│   ├── images/            # Product and brand images
│   ├── robots.txt         # SEO crawler instructions
│   ├── sitemap.xml        # Search engine sitemap
│   └── manifest.json      # PWA configuration
├── src/                    # Source code
│   ├── components/        # React components
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utility functions
│   ├── constants/         # App constants
│   ├── styles/            # CSS styles
│   └── types/             # TypeScript types
├── package.json           # Dependencies and scripts
└── vite.config.ts         # Vite configuration
```

## Development Workflow

### 1. Code Quality

The project uses several tools to maintain code quality:

- **TypeScript**: Strict type checking
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks

### 2. Component Development

When creating new components:

1. Create component folder in `src/components/common/`
2. Include TypeScript interface
3. Add CSS file with component-specific styles
4. Create index.ts for clean exports
5. Add to main components index

Example structure:

```
src/components/common/NewComponent/
├── NewComponent.tsx       # Component logic
├── NewComponent.css       # Component styles
├── index.ts              # Export statement
└── NewComponent.test.tsx  # Tests (optional)
```

### 3. SEO Integration

For SEO-optimized components:

1. Import SEO utilities: `import { useSEO } from '../../hooks'`
2. Add structured data if needed
3. Include proper semantic HTML
4. Add meta tag updates for page sections

## Production Deployment

### 1. Pre-deployment Checklist

- [ ] Update all URLs from localhost to production domain
- [ ] Configure analytics tracking codes
- [ ] Verify social media links
- [ ] Test all forms and interactions
- [ ] Run production build and test locally
- [ ] Optimize images for web

### 2. SEO Configuration

Before going live:

1. **Update Domain URLs**:
   - `public/robots.txt` - Update sitemap URL
   - `public/sitemap.xml` - Replace all URLs
   - `index.html` - Update canonical and Open Graph URLs

2. **Search Engine Setup**:
   - Google Search Console verification
   - Bing Webmaster Tools setup
   - Submit sitemap to search engines

3. **Analytics Setup**:
   - Google Analytics 4 configuration
   - Facebook Pixel (if using social ads)
   - Performance monitoring tools

### 3. Hosting Recommendations

**Recommended Platforms:**

- **Vercel**: Excellent for Vite/React apps
- **Netlify**: Good performance and easy setup
- **GitHub Pages**: Free option for static sites
- **AWS S3 + CloudFront**: Enterprise solution

**Domain & SSL:**

- Register domain (suggest: atyourdoorstep.shop)
- Enable SSL certificate
- Configure DNS settings
- Set up CDN for global performance

## Troubleshooting

### Common Issues

**Build Errors:**

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript Errors:**

```bash
# Run type checking
npm run type-check

# Check for unused imports
npx eslint src --fix
```

**Performance Issues:**

- Check image sizes (should be < 500KB each)
- Verify bundle size with `npm run build`
- Use browser dev tools for performance analysis

### Getting Help

- **Documentation**: Check relevant guides in `/docs`
- **Issues**: Create GitHub issue with detailed description
- **Developer Contact**: [Yash Turmbekar](https://www.linkedin.com/in/yashturmbekar)

## Next Steps

After setup:

1. **Customize Content**: Update product information and images
2. **SEO Setup**: Follow the [SEO Setup Guide](../seo/seo-setup.md)
3. **Social Media**: Configure business profiles
4. **Analytics**: Set up tracking and monitoring
5. **Testing**: Test across devices and browsers

---

_For detailed feature documentation, see the [Website Documentation](website-documentation.md)_
