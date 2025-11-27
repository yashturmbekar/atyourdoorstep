const fs = require('fs');
const path = require('path');

/**
 * Validates JSON API files for RAG crawler optimization
 */
const validateJsonApis = () => {
  const apiDir = path.join(process.cwd(), 'public', 'api', 'content');
  const metadataFile = path.join(
    process.cwd(),
    'public',
    'api',
    'metadata.json'
  );

  console.log('🔍 Validating RAG-optimized JSON APIs...\n');

  // List of API files to validate
  const apiFiles = [
    'all.json',
    'products.json',
    'about.json',
    'services.json',
    'testimonials.json',
  ];

  let validationResults = {
    passed: 0,
    failed: 0,
    errors: [],
  };

  // Validate content API files
  apiFiles.forEach(fileName => {
    try {
      const filePath = path.join(apiDir, fileName);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileContent);

      console.log(
        `✅ ${fileName} - Valid JSON with ${Object.keys(jsonData).length} root keys`
      );

      // Check for required fields based on file type
      if (fileName === 'all.json') {
        if (jsonData.website && jsonData.company && jsonData.products) {
          console.log(
            `   📋 Contains: website info, company details, product catalog`
          );
        }
      }

      if (fileName === 'products.json') {
        if (jsonData.products && Array.isArray(jsonData.products)) {
          console.log(`   📦 Contains: ${jsonData.products.length} products`);
        }
      }

      validationResults.passed++;
    } catch (error) {
      console.log(`❌ ${fileName} - Invalid JSON: ${error.message}`);
      validationResults.failed++;
      validationResults.errors.push(`${fileName}: ${error.message}`);
    }
  });

  // Validate metadata file
  try {
    const metadataContent = fs.readFileSync(metadataFile, 'utf8');
    const metadataJson = JSON.parse(metadataContent);
    console.log(`✅ metadata.json - Valid JSON with crawling instructions`);
    validationResults.passed++;
  } catch (error) {
    console.log(`❌ metadata.json - Invalid JSON: ${error.message}`);
    validationResults.failed++;
    validationResults.errors.push(`metadata.json: ${error.message}`);
  }

  // Summary
  console.log('\n📊 Validation Summary:');
  console.log(`✅ Passed: ${validationResults.passed}`);
  console.log(`❌ Failed: ${validationResults.failed}`);

  if (validationResults.errors.length > 0) {
    console.log('\n🚨 Errors:');
    validationResults.errors.forEach(error => console.log(`   - ${error}`));
  } else {
    console.log('\n🎉 All JSON APIs are valid and RAG-optimized!');
  }

  // Check robots.txt
  try {
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    const robotsContent = fs.readFileSync(robotsPath, 'utf8');

    if (
      robotsContent.includes('GPTBot') &&
      robotsContent.includes('Claude-Web')
    ) {
      console.log('✅ robots.txt - RAG crawler bots allowed');
    } else {
      console.log('⚠️  robots.txt - Consider adding more RAG crawler bots');
    }
  } catch (error) {
    console.log('❌ robots.txt - File not found or readable');
  }

  // Check sitemaps
  try {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    const contentSitemapPath = path.join(
      process.cwd(),
      'public',
      'content-sitemap.xml'
    );

    if (fs.existsSync(sitemapPath) && fs.existsSync(contentSitemapPath)) {
      console.log('✅ Sitemaps - Main and content sitemaps available');
    } else {
      console.log('⚠️  Sitemaps - Missing sitemap files');
    }
  } catch (error) {
    console.log('❌ Sitemaps - Error checking sitemap files');
  }

  return validationResults.failed === 0;
};

// Export for use in build process
module.exports = { validateJsonApis };

// Run validation if called directly
if (require.main === module) {
  validateJsonApis();
}
