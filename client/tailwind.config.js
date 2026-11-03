/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#ffffff', // Crisp pure white
          dark: '#000000',  // True pitch black
        },
        surface: {
          light: '#ffffff',
          dark: '#09090b',  // Clean zinc obsidian
          raised: {
            light: '#f4f4f5',
            dark: '#141416',
          },
          border: {
            light: '#e4e4e7',
            dark: '#27272a',
          },
        },
        primary: {
          DEFAULT: '#09090b',
          hover: '#18181b',
          subtle: '#f4f4f5',
          subtleDark: '#27272a',
        },
        flow: {
          DEFAULT: '#10b981', // Minimalist emerald
          subtle: '#ecfdf5',
          dark: '#064e3b',
          glow: 'rgba(16, 185, 129, 0.15)',
        },
        overload: {
          DEFAULT: '#f43f5e', // Minimalist rose
          subtle: '#fff1f2',
          dark: '#881337',
          glow: 'rgba(244, 63, 94, 0.15)',
        },
        boredom: {
          DEFAULT: '#f59e0b', // Minimalist amber
          subtle: '#fffbeb',
          dark: '#78350f',
          glow: 'rgba(245, 158, 11, 0.15)',
        },
        tier: {
          b: '#10b981', // Foundations (Emerald)
          a: '#71717a', // Core Standard (Monochrome Zinc)
          s: '#ffffff', // Advanced (High Contrast White)
        },
      },
      fontFamily: {
        sans: ['"Outfit"', '"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        syne: ['"Syne"', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        editorial: ['"Instrument Serif"', 'Georgia', 'serif'],
        cursive: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', '"Space Grotesk"', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        card: '0 2px 8px -2px rgba(15, 23, 42, 0.06), 0 1px 4px -1px rgba(15, 23, 42, 0.04)',
        elevated: '0 8px 24px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        glowCyan: '0 0 50px -10px rgba(6, 182, 212, 0.45)',
        glowPurple: '0 0 50px -10px rgba(168, 85, 247, 0.45)',
        glowIndigo: '0 0 60px -15px rgba(99, 102, 241, 0.5)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'progress-shimmer': 'shimmer 2s infinite linear',
        'spin-slow': 'spin 16s linear infinite',
        'text-shimmer': 'textShimmer 4s ease infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'aurora-glow': 'aurora 10s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        textShimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        aurora: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(30px, -20px) scale(1.08)' },
          '100%': { transform: 'translate(-20px, 20px) scale(0.96)' },
        },
      },
    },
  },
  plugins: [],
};

