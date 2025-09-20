import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

/**
 * DynamicSEO component that updates title, meta description, and structured data based on current page
 * @param {object} props - Component props
 * @param {string} props.loanType - Current loan type (mortgage, car, house, mobile)
 */
const DynamicSEO = ({ loanType }) => {
  const location = useLocation();
  const path = location.pathname;
  
  // Get page-specific SEO data
  const getSEOData = () => {
    // Base URL for canonical links
    const baseUrl = "https://example.com";
    
    // Default SEO values
    let title = "LoanMaster | Smart Loan Calculator";
    let description = "Free online loan calculator for mortgage, auto, and home loans. Compare rates, create amortization schedules, and save with our payment optimization tools.";
    let canonicalUrl = `${baseUrl}${path}`;
    let structuredData = null;
    
    // Page-specific SEO values
    switch(true) {
      case path === '/':
        title = "LoanMaster | Free Online Financial Calculator Tool";
        description = "Calculate mortgage, auto, home, and personal loan payments with our free calculator. Get detailed amortization schedules and save money with optimized payment plans.";
        break;
        
      case path === '/calculator':
        // Dynamic calculator title based on loan type
        if (loanType === "mortgage") {
          title = "Mortgage Calculator | Calculate Monthly Payments & Interest";
          description = "Calculate your monthly mortgage payments, total interest, and generate a complete amortization schedule with our free mortgage calculator.";
        } else if (loanType === "car") {
          title = "Car Loan Calculator | Auto Financing Payment Estimator";
          description = "Estimate monthly car payments, compare rates, and see how down payments affect your auto loan with our free car loan calculator.";
        } else if (loanType === "house") {
          title = "Home Loan Calculator | Compare Mortgage Options & Rates";
          description = "Plan your home purchase with our free home loan calculator. Calculate monthly payments, interest costs, and see how extra payments save money.";
        } else if (loanType === "mobile") {
          title = "Mobile Phone Loan Calculator | Device Financing Tool";
          description = "Compare mobile phone financing options and calculate monthly device payments with our free mobile loan calculator.";
        }
        break;
        
      case path === '/schedule':
        title = "Loan Amortization Schedule Calculator | Payment Breakdown";
        description = "Generate a detailed loan amortization schedule showing principal, interest, and remaining balance for each payment over the life of your loan.";
        
        // Additional structured data for amortization schedule
        structuredData = {
          "@context": "https://schema.org",
          "@type": "FinancialProduct",
          "name": "Loan Amortization Schedule",
          "description": "Complete payment schedule for loans showing principal and interest breakdown",
          "category": ["Mortgage", "Auto Loan", "Personal Loan"]
        };
        break;
        
      case path === '/reports':
        title = "Loan Comparison Reports | Compare Multiple Loan Options";
        description = "Compare different loan options side by side. See which loans save you money and find the best terms for your mortgage, auto, or personal loan.";
        break;
        
      case path === '/accessibility':
        title = "Accessibility Statement | LoanMaster";
        description = "Learn about our commitment to accessibility and how we ensure Loan Calculator Pro is usable by everyone, including those with disabilities.";
        break;
        
      default:
        // Keep default values for other pages
        break;
    }
    
    // Add loan type to canonical URL if on calculator page
    if (path === '/calculator' && loanType) {
      canonicalUrl = `${baseUrl}/calculator?loanType=${loanType}`;
    }
    
    return { title, description, canonicalUrl, structuredData };
  };
  
  const { title, description, canonicalUrl, structuredData } = getSEOData();
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="title" content={title} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      
      {/* Twitter */}
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:url" content={canonicalUrl} />
      
      {/* Structured data if available */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default DynamicSEO;
