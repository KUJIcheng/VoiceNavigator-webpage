import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',  // ✅ 确保 GitHub Pages 入口正确
			precompress: false,
			strict: true
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH || '/你的仓库名'
		},
		prerender: {
			entries: ['*']  // ✅ 让所有页面都生成 `index.html`
		}
	}
};

export default config;