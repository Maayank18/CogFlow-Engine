/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#f8fafc', // Warm neutral off-white
          dark: '#0b0f17',  // Deep graphite/charcoal
        },
        surface: {
          light: '#ffffff',
          dark: '#121824',
          raised: {
            light: '#f1f5f9',
            dark: '#1a2233',
          },
          border: {
            light: '#e2e8f0',
            dark: '#26334d',
          },
        },
        primary: {
          DEFAULT: '#3b82f6', // Restrained blue/indigo
          hover: '#2563eb',
          subtle: '#eff6ff',
          subtleDark: '#172554',
        },
        flow: {
          DEFAULT: '#0d9488', // Subtle teal for positive flow
          subtle: '#f0fdfa',
          dark: '#115e59',
          glow: 'rgba(13, 148, 136, 0.15)',
        },
        overload: {
          DEFAULT: '#e11d48', // Controlled rose/red
          subtle: '#fff1f2',
          dark: '#9f1239',
          glow: 'rgba(225, 29, 72, 0.15)',
        },
        boredom: {
          DEFAULT: '#d97706', // Controlled amber
          subtle: '#fffbeb',
          dark: '#92400e',
          glow: 'rgba(217, 119, 6, 0.15)',
        },
        tier: {
          b: '#059669', // Foundations (Emerald/Green)
          a: '#2563eb', // Core Standard (Blue)
          s: '#7c3aed', // Advanced (Violet/Purple)
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        card: '0 2px 8px -2px rgba(15, 23, 42, 0.06), 0 1px 4px -1px rgba(15, 23, 42, 0.04)',
        elevated: '0 8px 24px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        glowCyan: '0 0 50px -10px rgba(6, 182, 212, 0.35)',
        glowPurple: '0 0 50px -10px rgba(168, 85, 247, 0.35)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'progress-shimmer': 'shimmer 2s infinite linear',
        'spin-slow': 'spin 16s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

