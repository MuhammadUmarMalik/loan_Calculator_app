import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * Accessibility statement page
 * Contains information about the app's accessibility features and compliance
 */
const Accessibility = () => {
  return (
    <>
      <Helmet>
        <title>Accessibility Statement | Loan Calculator Pro</title>
        <meta name="description" content="Our commitment to accessibility and inclusivity for all users of our loan calculator app" />
      </Helmet>

      <div className="prose max-w-none">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Accessibility Statement</h1>
        
        <p className="mb-4">
          At Loan Calculator Pro, we are committed to ensuring that our website and tools are accessible to all users,
          regardless of ability or technology. We strive to meet or exceed the requirements of the Web Content
          Accessibility Guidelines (WCAG) 2.1 Level AA.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">Accessibility Features</h2>
        
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Keyboard Navigation: All features and functionality are accessible using a keyboard</li>
          <li>Screen Reader Support: Our app is designed to work with screen readers like NVDA, JAWS, and VoiceOver</li>
          <li>Text Resizing: Content can be resized up to 200% without loss of functionality</li>
          <li>Color Contrast: We maintain a minimum contrast ratio of 4.5:1 for text content</li>
          <li>Focus Indicators: Visible focus indicators help keyboard users navigate</li>
          <li>Skip Links: Skip navigation links allow keyboard users to bypass repetitive content</li>
          <li>ARIA Attributes: We use ARIA roles and properties to enhance accessibility</li>
          <li>Descriptive Link Text: Links have descriptive text that makes sense out of context</li>
          <li>Form Labels: All form fields have proper labels and error messages</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">Conformance Status</h2>
        
        <p className="mb-4">
          The Web Content Accessibility Guidelines (WCAG) define requirements for designers and developers to improve 
          accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
        </p>
        
        <p className="mb-4">
          Loan Calculator Pro is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts 
          of the content do not fully conform to the accessibility standard.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">Compatibility with Browsers and Assistive Technology</h2>
        
        <p className="mb-4">
          Loan Calculator Pro is designed to be compatible with the following browsers and assistive technologies:
        </p>
        
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Latest versions of Chrome, Firefox, Safari, and Edge</li>
          <li>NVDA and JAWS with Chrome or Firefox</li>
          <li>VoiceOver with Safari on macOS and iOS</li>
          <li>TalkBack with Chrome on Android</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">Feedback and Contact Information</h2>
        
        <p className="mb-4">
          We welcome your feedback on the accessibility of Loan Calculator Pro. If you experience any accessibility barriers 
          or have suggestions for improvement, please contact us:
        </p>
        
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Email: <a href="mailto:accessibility@loancalculatorpro.com" className="text-primary">accessibility@loancalculatorpro.com</a></li>
          <li>Phone: <a href="tel:+18001234567" className="text-primary">1-800-123-4567</a></li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">Assessment Approach</h2>
        
        <p className="mb-4">
          Loan Calculator Pro has assessed the accessibility of our website by the following approaches:
        </p>
        
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Self-evaluation using automated and manual testing tools</li>
          <li>Testing with screen readers</li>
          <li>Keyboard navigation testing</li>
          <li>Color contrast analysis</li>
        </ul>
        
        <p className="mb-4">
          This statement was last updated on August 1, 2023.
        </p>
      </div>
    </>
  );
};

export default Accessibility;
