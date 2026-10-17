import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'scir-bg': '#0F1225',      /* Основной темный фон */
        'scir-indigo': '#1B1F3B',  /* Фон карточек */
        'scir-emerald': '#2EC4A6', /* Бирюзовый (акцент) */
        'scir-amethyst': '#8B5CF6',/* Фиолетовый (акцент) */
        'scir-pink': '#F0A6CA',    /* Розовый (акцент) */
      },
      fontFamily: {
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
