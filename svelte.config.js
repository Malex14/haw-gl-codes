import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$assets: path.resolve('./src/lib/assets'),
		},
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'img-src': ['self', 'blob:', 'data:'],
				'style-src': ['self', 'unsafe-inline'],
				'font-src': ['self'],
				'script-src': ['strict-dynamic'],
				'connect-src': [
					'self',
					...(process.env.NODE_ENV === 'production'
						? []
						: ['ws://localhost:*', 'localhost:*', 'ws://127.0.0.1:*', '127.0.0.1:*']),
				],
				'base-uri': ['self'],
				'form-action': ['self'],
				'object-src': ['none'],
				'frame-src': ['none'],
				'worker-src': ['none'],
				'media-src': ['none'],
			},
		},
	},
};

export default config;
