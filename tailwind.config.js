/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        paper: 'var(--paper)',
        'paper-soft': 'var(--paper-soft)',
        gold: 'var(--gold)',
        'gold-deep': 'var(--gold-deep)',
        charcoal: 'var(--charcoal)',
        'alert-red': 'var(--alert-red)',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Jost', 'Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
