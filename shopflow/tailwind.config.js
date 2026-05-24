/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      colors: {
        gold: {
          300: '#f0d080',
          400: '#e8c44a',
          500: '#d4aa30',
          600: '#b8921a',
        },
        luxury: {
          50: '#f9f7f4',
          100: '#f2ede5',
          900: '#1a1410',
          950: '#0d0b08',
        },
      },
    },
  },
  plugins: [],
}

