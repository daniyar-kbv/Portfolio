import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: '#1E2A38',
        elevated: '#29394C',
        'elevated-alt': '#243242',
        'elevated-alt-2': '#212E3D',
        'elevated-2': '#344A63',
        accent: '#FF6600',
        'accent-hover': '#FF7A1A',
        'nav-active': '#0D63D1',
        'nav-text': '#C5C5C7',
        text: '#FFFFFF',
        muted: 'rgba(255,255,255,0.72)',
        'text-soft': 'rgba(255,255,255,0.56)',
        border: 'rgba(255,255,255,0.10)',
        'border-strong': 'rgba(255,255,255,0.18)',
      },
      fontFamily: {
        sf: [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Text',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [typography],
};
