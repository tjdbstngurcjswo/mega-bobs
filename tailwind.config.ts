import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1E40AF',
          light: '#60A5FA',
        },
        text: {
          primary: '#0A0A0A',
          secondary: '#1E2939',
          tertiary: '#4A5565',
        },
        accent: {
          blue: {
            light: '#EFF6FF',
            lighter: '#F8FAFC',
          }
        }
      },
      fontSize: {
        'xs': '10px',
        'sm': '11px',
        'base': '12px',
        'md': '14px',
        'lg': '16px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
      },
      maxWidth: {
        'container': '375px',
      },
      borderRadius: {
        'base': '12px',
        'lg': '20px',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(90deg, #2563EB 0%, #4F46E5 50%, #7C3AED 100%)',
        'gradient-card': 'linear-gradient(45deg, rgba(255, 255, 255, 1) 0%, rgba(239, 246, 255, 0.3) 100%)',
      },
      backdropBlur: {
        'xs': '8px',
        'sm': '16px',
      },
      boxShadow: {
        'card': '0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)',
      }
    },
  },
  plugins: [],
}

export default config 