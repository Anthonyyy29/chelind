/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chelsea: {
          navy: '#00144d',
          darkNavy: '#000f3a',
          blue: '#001f66',
          hoverBlue: '#002db3',
          accent: '#2563eb',
          grayBg: '#bebebe',
          lightGray: '#dcdcdc',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
