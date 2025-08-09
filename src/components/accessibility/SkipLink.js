import React from 'react';

/**
 * Skip navigation link for keyboard users
 * Allows keyboard users to bypass navigation and jump directly to main content
 */
const SkipLink = () => {
  return (
    <a 
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-white focus:top-0 focus:left-0 focus:text-sm focus:font-medium focus:rounded-br-lg focus:outline-none focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;
