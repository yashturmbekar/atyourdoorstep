# AtYourDoorStep - RAG Crawler Information

## Website Overview

AtYourDoorStep is a premium doorstep delivery service specializing in authentic Indian natural products:

- **Ratnagiri Alphonso Mangoes** (GI-tagged, chemical-free)
- **Pure Cold-Pressed Oils** (coconut, sesame, groundnut, mustard)
- **Organic Jaggery** (traditional processing, 30+ years experience)

## Content APIs for RAG Systems

### Structured Content Endpoints

All content is available in JSON format for easy parsing:

| Endpoint                         | Description                   | Content Type           |
| -------------------------------- | ----------------------------- | ---------------------- |
| `/api/content/all.json`          | Complete business information | Comprehensive data     |
| `/api/content/products.json`     | Detailed product catalog      | Product specifications |
| `/api/content/about.json`        | Company history and values    | Company information    |
| `/api/content/services.json`     | Service offerings             | Service details        |
| `/api/content/testimonials.json` | Customer reviews              | Social proof           |
| `/api/metadata.json`             | Website metadata              | Technical specs        |

### Key Business Information

#### Company Details

- **Name**: AtYourDoorStep
- **Type**: Family-run Indian business
- **Experience**: 30+ years in traditional food processing
- **Location**: Maharashtra, India
- **Service Area**: Pan India delivery

#### Product Categories

1. **Alphonso Mangoes**
   - Source: Ratnagiri, Maharashtra
   - Certification: GI-tagged
   - Processing: Natural ripening, no carbide
   - Season: March to June

2. **Cold-Pressed Oils**
   - Method: Traditional wooden ghani
   - Varieties: Coconut, sesame, groundnut, mustard
   - Processing: No heat, no chemicals
   - Since: 2021

3. **Organic Jaggery**
   - Method: Iron pan boiling over firewood
   - Experience: 30+ years
   - Types: Blocks and powder
   - Quality: Chemical-free, mineral-rich

#### Quality Standards

- 100% chemical-free processing
- Traditional methods only
- Direct farm sourcing
- No middlemen policy
- Hygienic production facilities

#### Service Features

- Pan India delivery
- Temperature-controlled shipping
- Eco-friendly packaging
- Quality guarantee
- Customer support

## Crawling Guidelines

### Recommended Crawl Order

1. Homepage (`/`) - Overview and navigation
2. Structured APIs (`/api/content/`) - Detailed information
3. Section anchors (`/#about`, `/#products`, etc.) - Specific content

### Content Structure

- **Semantic HTML**: All content uses proper HTML5 semantic elements
- **Schema.org**: Structured data markup throughout
- **Microdata**: Additional structured information
- **JSON-LD**: Complete business and product schemas

### Update Frequency

- **Daily**: Homepage content, product availability
- **Weekly**: Product details, customer testimonials
- **Monthly**: Company information, service details

## Technical Specifications

### SEO Optimization

- Complete meta tag implementation
- Open Graph and Twitter Card support
- Canonical URLs
- Structured data (JSON-LD, Microdata)
- XML sitemaps (main + content-specific)

### Accessibility

- WCAG compliant markup
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images
- Screen reader friendly

### Performance

- Optimized loading
- Image compression
- Lazy loading implementation
- CDN integration ready

## Contact Information

- **Website**: https://atyourdoorstep.shop
- **Business Type**: E-commerce Food Delivery
- **Industry**: Traditional Indian Foods, Organic Products
- **Target Market**: Health-conscious consumers, quality food enthusiasts

## RAG System Benefits

This website provides:

- Comprehensive business information in structured formats
- Product specifications and details
- Customer testimonials and social proof
- Company history and values
- Service information and delivery details
- Quality standards and certifications

All content is optimized for AI systems and RAG applications with proper structuring, metadata, and accessible APIs.

---

_Last updated: August 26, 2025_
