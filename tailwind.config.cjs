/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: '12x',
            screens: {
                sm: '100%',
                md: '100%',
                lg: '100%',
                xl: '100%',
                '2xl': '100%',
            },
        },
        extend: {
            aspectRatio: {
                auto: 'auto',
                square: '1 / 1',
                video: '16 / 9',
            },
            fontSize: {
                tiny: '.625rem',
            },
            colors: {
                primary: 'var(--color-primary)',
                'primary-lighter': 'var(--color-primary-lighter)',
                secondary: 'var(--color-secondary)',
                CF0: 'var(--color-CF0)',
                CD1: 'var(--color-CD1)',
                C12: 'var(--color-C12)',
                C92: 'var(--color-C92)',
                CE8: 'var(--color-CE8)',
                CEB: 'var(--color-CEB)',
                CE1: 'var(--color-CE1)',
                C90: 'var(--color-C90)',
                C62: 'var(--color-C62)',
                CEA: 'var(--color-CEA)',
                CF2: 'var(--color-CF2)',
                C91: 'var(--color-C91)',
                error: 'var(--color-error)',
                success: 'var(--color-success)',
            },
            borderColor: {
                DEFAULT: 'var(--color-CE8)',
            },
            boxShadow: {
                DEFAULT: 'var(--base-box-shadow)',
                lg: 'var(--lg-box-shadow)'
            },
        },
    },
    corePlugins: {
        aspectRatio: false,
    },
    plugins: [
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/line-clamp'),
        function ({addVariant}) {
            addVariant('child', '& > *');
            addVariant('child-hover', '& > *:hover');
        }
    ],
}
