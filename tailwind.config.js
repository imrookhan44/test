const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", //look for all these file extentions in the target repository
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto Mono", ...defaultTheme.fontFamily.sans] }
    },
   /* colors: {
      'brand-purple': 'var(--clr-purple)',
      'brand-pink': 'var(--clr-pink)',
      'brand-yellow': 'var(--clr-yellow)',
      'brand-blue': 'var(--clr-blue)',
      'brand-green': 'var(--clr-green)',
      'brand-light': 'var(--clr-light)',
      'brand-background': 'var(--clr-background)'
    },*/
    animation: {
      'pulse-slow': 'pulse 13s linear infinite'
    }
  },
  plugins: [],
}
