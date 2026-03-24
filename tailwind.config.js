/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary':    'var(--bg-primary)',
        'bg-secondary':  'var(--bg-secondary)',
        'bg-card':       'var(--bg-card)',
        'bg-glass':      'var(--bg-glass)',
        'bg-card-hover': 'var(--bg-card-hover)',

        'text-primary':  'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted':    'var(--text-muted)',
        'text-faint':    'var(--text-faint)',

        'accent':        'var(--accent-blue)',
        'accent-2':      'var(--accent-blue-2)',
        'accent-cyan':   'var(--accent-cyan)',

        'border-d':      'var(--border-default)',
        'border-h':      'var(--border-hover)',
        'border-strong': 'var(--border-strong)',
        
        // Keep the fixed blue ramp for gradients/accents that DON'T change
        blue: {
          300: '#4DAAFF', 400: '#2B8FFF', 500: '#1D6FE8',
        },
      },
      boxShadow: {
        'glow':    'var(--glow-blue)',
        'glow-sm': 'var(--glow-sm)',
      },
      backgroundImage: {
        'gradient-brand':   'var(--gradient-brand)',
        'gradient-brand-h': 'var(--gradient-brand-h)',
      },
      fontFamily: {
        comes: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
