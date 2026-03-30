module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'EB Garamond', 'Playfair Display', 'serif'],
        sans: ['Montserrat', 'Helvetica Neue', 'sans-serif'],
      },
      colors: {
        'editorial-white': '#FFFFFF',
        'editorial-black': '#111111',
        'editorial-gray': '#777777',
        'editorial-light-gray': '#eaeaea',
      },
      maxWidth: {
        'editorial': '650px',
      },
      spacing: {
        'editorial': '4rem',
      },
      letterSpacing: {
        'wide': '0.1em',
        'wider': '0.2em',
      },
    },
  },
  plugins: [],
}