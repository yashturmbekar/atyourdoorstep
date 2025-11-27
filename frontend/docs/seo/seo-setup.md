# SEO Setup Instructions

## Quick Setup for Search Engines

### 1. Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your domain property
3. Verify ownership using HTML file method
4. Upload the verification file to `/public/` directory
5. Submit your sitemap: `https://yourdomain.com/sitemap.xml`

### 2. Bing Webmaster Tools

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site
3. Verify ownership
4. Submit sitemap

### 3. Update URLs in Files

Replace placeholder URLs in these files with your actual domain:

- `public/robots.txt` - Update sitemap URL
- `public/sitemap.xml` - Update all URLs
- `index.html` - Update canonical and Open Graph URLs
- `src/utils/seo.ts` - Update canonical URLs in seoConfigs

## Analytics Setup

### Google Analytics 4

Add this script to `index.html` head section:

```html
<!-- Google tag (gtag.js) -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Facebook Pixel (Optional)

Add to `index.html` for social media advertising:

```html
<!-- Facebook Pixel -->
<script>
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    'script',
    'https://connect.facebook.net/en_US/fbevents.js'
  );
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

## Content Optimization Tips

1. **Regular Blog Posts**: Add fresh content about mangoes, oils, and jaggery
2. **Customer Reviews**: Implement review schema markup
3. **Local SEO**: Add location pages for different cities
4. **Seasonal Content**: Update for mango season timing
5. **FAQ Section**: Add frequently asked questions

## Performance Monitoring

Set up monitoring for:

- Core Web Vitals
- Search console performance
- Organic traffic growth
- Keyword rankings
- Local search visibility

## Maintenance Schedule

- **Weekly**: Check search console for issues
- **Monthly**: Update sitemap if needed
- **Quarterly**: SEO audit and optimization
- **Seasonally**: Update seasonal content and keywords
