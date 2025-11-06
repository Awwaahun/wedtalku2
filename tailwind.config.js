/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Font dari CSS variables
        'heading': ['var(--font-heading)', 'serif'],
        'body': ['var(--font-body)', 'sans-serif'],
        'script': ['var(--font-script)', 'cursive'],
        
        // Alias untuk compatibility
        'serif': ['var(--font-heading)', 'serif'],
        'sans': ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
