/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#1A73E8",    // Royal Blue
        "primary-dark": "#0f5ac9",
        "primary-light": "#3b8ced",
        secondary: "#F1F5F9",  // Light Gray
        accent: "#34D399",     // Mint Green
        success: "#10B981",    // Green
        warning: "#FBBF24",    // Amber
        error: "#EF4444",      // Red
        info: "#3B82F6",       // Blue
        
        // Light theme colors
        "text-primary": "#111827", // Almost Black
        "text-secondary": "#6B7280", // Gray 600
        "bg-primary": "#FFFFFF",
        "bg-secondary": "#F9FAFB",
        "border-light": "#E5E7EB",
        
        // Dark theme colors
        "dark-bg-primary": "#111827",
        "dark-bg-secondary": "#1F2937",
        "dark-text-primary": "#F9FAFB",
        "dark-text-secondary": "#D1D5DB",
        "dark-border": "#374151",
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'slideIn': 'slideIn 0.4s ease-in-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'dark-card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            a: {
              color: '#1A73E8',
              '&:hover': {
                color: '#0f5ac9',
              },
            },
          },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
}