/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2249D6',
          'primary-dark': '#09206E',
          navy: '#0F1737',
          'soft-blue': '#F5F8FC',
          'light-blue': '#DEE8FD',
        },
        accent: {
          DEFAULT: '#C66130',
          dark: '#A7491F',
          soft: '#D3835F',
          peach: '#F3B693',
        },
        state: {
          success: '#5C7F2E',
          warning: '#C66130',
          danger: '#A02E1F',
          info: '#2249D6',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F5F8FC',
          subtle: '#F2F2F2',
          bordered: '#E8EDF5',
        },
        content: {
          primary: '#0F1737',
          secondary: '#3B4A6B',
          tertiary: '#6B7894',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 4px rgba(15,23,55,0.06), 0 0 0 1px rgba(15,23,55,0.06)',
        'card-hover': '0 4px 16px rgba(15,23,55,0.10), 0 0 0 1px rgba(15,23,55,0.08)',
        elevated: '0 8px 32px rgba(15,23,55,0.12)',
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
};
