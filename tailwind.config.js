const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    maxWidth: {
      200: '240px',
    },
    extend: {
      fontFamily: {
        sans: [
          'PingFang SC',
          'Microsoft YaHei',
          '-apple-system',
          'BlinkMacSystemFont',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ], // 使用 'Inter' 作为主要的无衬线字体
        serif: [
          'PingFang SC',
          'Microsoft YaHei',
          '-apple-system',
          'BlinkMacSystemFont',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ], // 使用 'Georgia' 作为主要的衬线字体
      },
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        default: '0 2px 4px var(--tw-shadow-color)',
      },
      borderRadius: {},
      boxShadow: {
        primaryShadow: 'var(--color-primary-shadow)',
      },
      backgroundImage: {
        primaryBg: 'var(--color-primary-bg)',
        badgeBg: 'var(--color-badge-bg)',
      },
      colors: {
        defaultText: 'var(--color-default-text)',
        primaryText: 'var(--color-primary-text)',
        secondaryText: 'var( --color-secondary-text)',
        successText: 'var(--color-success-text)',
        errorText: 'var(--color-error-text)',
        coinText: 'var(--color-coin-text)',
        defaultBg: 'var(--color-default-bg)',
        primaryHoverBg: 'var(--color-primary-hover-bg)',
        secondaryBg: 'var(--color-secondary-bg)',
        secondaryHoverBg: 'var(--color-secondary-hover-bg)',
        cardOperateBg: 'var(--color-card-operate-bg)',
        reverstBg: 'var(--color-reverst-bg)',
        primaryBorder: 'var(--color-primary-border)',
        secondaryBorder: 'var(--color-secondary-border)',
        headerBorder: 'var(--color-header-border)',
        divideBorder: 'var(--color-divide-border)',
        activeText: 'var(--color-active-text)',
      },
    },
    screens: {
      xs: '576px',
      sm: '768px',
      md: '992px',
      lg: '1200px',
      xl: '1400px',
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      );
    }),
  ],
};
