/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.edge",
    "./resources/**/*.{js,ts,jsx,tsx,svelte}",
    './inertia/{pages,components,app,layouts}/**/*.{ts,tsx,svelte}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

