import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // CSS Variables を Tailwind の色トークンとして公開
        primary:    'var(--color-primary)',
        background: 'var(--color-background)',
        surface:    'var(--color-surface)',
        text:       'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        border:     'var(--color-border)',
        'on-primary': 'var(--color-on-primary)',
      },
      screens: {
        // bp: モバイル名刺 → タブレット/PC Webレイアウトの境界
        web: '768px',
      },
    },
  },
  plugins: [],
};
export default config;
