/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0a0e27',
        'dark-secondary': '#1a1f3a',
        accent: '#7c3aed'
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
        'gradient-accent': 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)'
      }
    }
  },
  plugins: []
};
