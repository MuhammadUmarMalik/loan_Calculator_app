import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="text-center py-4 text-gray-500 text-sm">
      © {currentYear} Mortgage Calculator. All rights reserved.
    </div>
  );
};

export default Footer;
