import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',  // ✅ 这里改成 index.html，避免 404
			precompress: false,
			strict: true
		}),
		prerender: {
			default: true  // ✅ 确保所有页面都被 prerender 成静态 HTML
		},
		paths: {
			base: process.env.BASE_PATH || ''
		}
	}
};

export default config;