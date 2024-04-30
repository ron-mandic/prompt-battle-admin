import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ViteDevServer } from 'vite';
import { Server as WS } from 'socket.io';

// Credits: https://joyofcode.xyz/using-websockets-with-sveltekit#websockets-for-production

const webSocketServer = {
	name: 'webSocketServer',
	configureServer: async (server: ViteDevServer) => {
		if (!server.httpServer) return;

		const io = new WS(server.httpServer, {
			cors: {
				origin: ['http://localhost:5173', 'http://localhost:5174']
			}
		});

		io.on('connection', (socket) => {
			socket.emit('eventFromServer', 'Hello, World 👋');
		});
	}
};

export default defineConfig({
	plugins: [sveltekit(), webSocketServer],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
