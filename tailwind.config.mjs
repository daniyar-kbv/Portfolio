import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: '#1E2A38',
        elevated: '#29394C',
        'elevated-2': '#344A63',
        accent: '#FF6600',
        'accent-hover': '#FF7A1A',
        text: '#FFFFFF',
        muted: 'rgba(255,255,255,0.72)',
        'text-soft': 'rgba(255,255,255,0.56)',
        border: 'rgba(255,255,255,0.10)',
        'border-strong': 'rgba(255,255,255,0.18)',
      },
    },
  },
  plugins: [typography],
};
