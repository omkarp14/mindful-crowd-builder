/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // HiveFund custom colors
        honeyGold: '#FFC107',
        honeyLight: '#FFD54F',
        honeyDark: '#FFA000',
        deepNavy: '#1E3A5F',
        navyLight: '#2C5282',
        navyDark: '#1A365D',
        softCream: '#FAF3E0',
        forestGreen: '#3E7C6D',
        charcoal: '#333333'
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        primary: ['Poppins', 'sans-serif'],
        secondary: ['Merriweather', 'serif']
      },
      keyframes: {
        buzz: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' }
        },
        honeyDrip: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: 1 },
          '70%': { transform: 'translateY(10px) scale(0.9)', opacity: 0.7 },
          '100%': { transform: 'translateY(20px) scale(0.8)', opacity: 0 }
        },
        hexagonPulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        buzz: 'buzz 0.3s ease-in-out',
        honeyDrip: 'honeyDrip 2s ease-in-out infinite',
        hexagonPulse: 'hexagonPulse 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        'honeycomb-pattern': "url('/patterns/honeycomb.svg')"
      },
      boxShadow: {
        'honey': '0 4px 14px 0 rgba(255, 193, 7, 0.39)',
      }
    },
  },
  plugins: [],
} 