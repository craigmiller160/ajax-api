import { defineConfig } from '@craigmiller160/js-config/configs/vite/vite.config.mjs';

export default defineConfig({
	test: {
		environment: 'jsdom',
		setupFiles: ['./setupTests.ts']
	}
});
