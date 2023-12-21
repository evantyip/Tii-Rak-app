/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'floral-white': '#FFFAED',
				'mimi-pink': '#FFDEE9',
				eggplant: '#724966',
				'carnation-pink': '#FEACC6',
				'pacific-cyan': '#06AED5',
				olivine: '#93AB6B'
			}
		}
	},
	plugins: [require('@tailwindcss/forms')]
};
