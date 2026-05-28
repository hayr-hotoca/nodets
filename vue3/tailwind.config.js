import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006a60',
          dark: '#00544c',
          light: '#74f8e5',
        },
        'on-primary': '#ffffff',
        secondary: {
          DEFAULT: '#4a635f',
        },
        'on-secondary': '#ffffff',
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        'on-error': '#ffffff',
        'on-error-container': '#410002',
        surface: {
          DEFAULT: '#fafdfb',
          container: {
            lowest: '#ffffff',
            low: '#f4f7f5',
            DEFAULT: '#eef1ef',
            high: '#e8ebe9',
            highest: '#e2e5e3',
          }
        },
        'on-surface': '#191c1b',
        'on-surface-variant': '#3f4947',
        outline: {
          DEFAULT: '#6f7977',
          variant: '#bec9c6',
        }
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
        title: ['Inter', 'sans-serif'],
        label: ['Inter', 'sans-serif'],
      },
      spacing: {
        'stack-sm': '0.5rem',
        'stack-md': '1rem',
        'stack-lg': '1.5rem',
      }
    },
  },
  plugins: [
    forms,
  ],
}
