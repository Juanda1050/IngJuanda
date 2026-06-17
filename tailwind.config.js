import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          '"SF Pro Icons"',
          '"Apple Color Emoji"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'sleep-led': {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.6' },
        },
        'shutdown-pulse': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.98)' },
          '50%': { opacity: '0.7', transform: 'scale(1.02)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease forwards',
        'sleep-led': 'sleep-led 5s ease-in-out infinite',
        'shutdown-pulse': 'shutdown-pulse 4s ease-in-out infinite',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        'vscode-surface': 'hsl(var(--vscode-surface))',
        'vscode-titlebar': 'hsl(var(--vscode-titlebar))',
        'vscode-activity': 'hsl(var(--vscode-activity))',
        'vscode-sidebar': 'hsl(var(--vscode-sidebar))',
        'vscode-tabs': 'hsl(var(--vscode-tabs))',
        'vscode-editor': 'hsl(var(--vscode-editor))',
        'vscode-status': 'hsl(var(--vscode-status))',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
