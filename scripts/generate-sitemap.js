const fs = require('fs');
const path = require('path');

// Base URL - update this to your production domain
const baseUrl = 'https://example.com';

// Current date in ISO format
const today = new Date().toISOString().split('T')[0];

/**
 * Generate a sitemap.xml file dynamically
 */
async function generateSitemap() {
  // Define your site pages with metadata
  const pages = [
    // Main pages
    { url: '/', changefreq: 'weekly', priority: '1.0' },
    { url: '/calculator', changefreq: 'weekly', priority: '0.9' },
    { url: '/schedule', changefreq: 'weekly', priority: '0.8' },
    { url: '/reports', changefreq: 'weekly', priority: '0.8' },
    { url: '/accessibility', changefreq: 'monthly', priority: '0.7' },
    
    // Loan type specific pages
    { url: '/calculator?loanType=mortgage', changefreq: 'weekly', priority: '0.8' },
    { url: '/calculator?loanType=car', changefreq: 'weekly', priority: '0.8' },
    { url: '/calculator?loanType=house', changefreq: 'weekly', priority: '0.8' },
    { url: '/calculator?loanType=mobile', changefreq: 'weekly', priority: '0.7' },
    
    // Resource pages
    { url: '/calculator/mortgage-tips', changefreq: 'monthly', priority: '0.7' },
    { url: '/calculator/auto-loan-guide', changefreq: 'monthly', priority: '0.7' },
    { url: '/calculator/home-loan-resources', changefreq: 'monthly', priority: '0.7' },
    
    // User account pages removed
    
    // Help pages
    { url: '/faq', changefreq: 'monthly', priority: '0.6' },
    { url: '/help', changefreq: 'monthly', priority: '0.6' },
    { url: '/loan-glossary', changefreq: 'monthly', priority: '0.6' }
  ];

  // XML sitemap header
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

  // Add each page to the sitemap
  pages.forEach(page => {
    sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}T12:00:00+00:00</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  // Close the sitemap
  sitemap += `
</urlset>`;

  // Write the sitemap to the public directory
  fs.writeFileSync(
    path.resolve(__dirname, '../public/sitemap.xml'),
    sitemap,
    'utf8'
  );

  console.log('Sitemap generated successfully!');
}

// Run the generator
generateSitemap();
