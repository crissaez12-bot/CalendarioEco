/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        ivory: '#FAF6EC',
        beige: '#D9C7A3',
        navy: '#0a0a0a',
        olive: '#3B3D22',
        moss: '#9BAE6B',
        clay: '#8C5A38',
      },
    },
  },
  plugins: [],
}
