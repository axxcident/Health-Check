import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        backgroundBlue: 'rgb(128, 199, 215)',
      },
    },
    screens: {
      xxsm: '320px',
      xsm: '401px',
      sm: '640px',
      md: '768px',
      laptop: '900px',
      lg: '1024px',
      xl: '1280px',
    },
  },
  plugins: [],
};
export default config;
