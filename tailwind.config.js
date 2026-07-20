/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        logo: ['Lora', 'serif'],
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        ivory: '#F2FBF7',
        beige: '#7FA396',
        navy: '#0B1F1A',
        olive: '#173A30',
        moss: '#5FE6AE',
        clay: '#FF6B6B',
      },
    },
  },
  plugins: [],
}
