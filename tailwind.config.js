/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Space Mono"', '"Courier New"', 'monospace'],
      },
      colors: {
        cream:    '#F9F6F0',
        charcoal: '#111111',
        sand:     '#E6E1DA',
      },
    },
  },
  plugins: [],
};
