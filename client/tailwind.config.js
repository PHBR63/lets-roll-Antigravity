/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Paleta Gamer (escuro com acentos neon)
                primary: {
                    50: '#f0f4ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
                dark: {
                    900: '#0a0a0f',
                    800: '#111118',
                    700: '#1a1a24',
                    600: '#24243a',
                    500: '#2d2d44',
                },
                neon: {
                    purple: '#b794f6',
                    blue: '#63b3ed',
                    pink: '#f687b3',
                    green: '#68d391',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
