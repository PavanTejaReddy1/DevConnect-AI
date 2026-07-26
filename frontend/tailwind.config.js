/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // toggle via a 'dark' class on <html> — supports the Settings > dark mode requirement
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1E40AF', // "secondary" in the spec, used as primary's hover/dark shade
        },
        secondary: '#1E40AF',
        accent: '#38BDF8',
        background: '#F8FAFC',
        card: '#FFFFFF',
        text: '#0F172A',
        border: '#E2E8F0',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',

        // dark-mode counterparts, referenced as dark-* utilities via CSS variables (see index.css)
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Space Grotesk carries the page's headline personality — a geometric,
        // slightly technical display face that reads distinctly from the Inter body copy.
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(15, 23, 42, 0.08)',
        card: '0 2px 10px -2px rgba(15, 23, 42, 0.06)',
        glow: '0 0 0 1px rgba(56, 189, 248, 0.15), 0 8px 24px -4px rgba(37, 99, 235, 0.25)',
      },
      backdropBlur: {
        glass: '12px',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(3%, 4%) scale(1.05)' },
          '66%': { transform: 'translate(-3%, 2%) scale(0.97)' },
        },
        particleFloat: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: 0.4 },
          '50%': { transform: 'translateY(-18px) translateX(6px)', opacity: 0.9 },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        drift: 'drift 18s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
