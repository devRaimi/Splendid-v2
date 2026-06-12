/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,jsx}'],
	theme: {
		extend: {
			colors: {
				ink: { DEFAULT: '#0D0D0D', soft: '#3D3730' },
				puff: { DEFAULT: '#FF5C00', dim: '#CC4900' },
				paper: {
					DEFAULT: '#F7F4F0',
					warm: '#EDE8E1',
					border: '#D4CCC4',
					muted: '#A89E94',
				},
				night: { DEFAULT: '#141210', surface: '#1E1A16' },
			},
			fontFamily: {
				display: ['Syne', 'ui-sans-serif', 'sans-serif'],
				sans: ['DM Sans', 'ui-sans-serif', 'sans-serif'],
				mono: ['DM Mono', 'ui-monospace', 'monospace'],
				urbanist: ['Urbanist', 'ui-sans-serif'],
			},
			keyframes: {
				'slide-up': {
					from: { transform: 'translateY(12px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' },
				},
				pop: {
					'0%': { transform: 'scale(0.93)', opacity: '0' },
					'60%': { transform: 'scale(1.02)' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				shake: {
					'0%,100%': { transform: 'translateX(0)' },
					'20%,60%': { transform: 'translateX(-6px)' },
					'40%,80%': { transform: 'translateX(6px)' },
				},
			},
			animation: {
				'slide-up': 'slide-up 0.35s cubic-bezier(0.22,1,0.36,1) both',
				pop: 'pop 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
				shake: 'shake 0.4s ease',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
