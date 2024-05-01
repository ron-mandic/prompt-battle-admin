import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ViteDevServer } from 'vite';
import { Socket, Server } from 'socket.io';
import { PromptTournament } from './src/lib/ts/classes';
import { CHALLENGES, HTTP_SERVER_OPTIONS } from './src/lib/ts/constants';

// Credits: https://joyofcode.xyz/using-websockets-with-sveltekit#websockets-for-production

/**
 * IMPORTANT:
 *
 * - Please restart the server first before opening the client tabs
 * - If you close one client tab, close the other one too (no management of disconnections)
 * - Only 2 players are currently allowed in this tournament for each round
 * - If you refresh the server code, you need to restart the development server (no hot reload)
 */

let socketIdAdmin: null | string = null;
let socketIdProjector: null | string = null;
let roundArgs: string[];
const pT = new PromptTournament(CHALLENGES);

const webSocketServer = {
	name: 'webSocketServer',
	configureServer: async (server: ViteDevServer) => {
		if (!server.httpServer) return;
		const io = new Server(server.httpServer, HTTP_SERVER_OPTIONS);

		const [r, n] = pT.currentRound;
		roundArgs = pT.roundToArgs(pT.rounds(r, n));
		const player0 = roundArgs[0];

		// ###########################################################

		io.on('connection', (socket: Socket) => {
			// console.log(socket.id); -> Unreliable due to async nature of socket.io

			socket.on('client:__connect__', (data) => {
				pT.join(socket.id, data);
				io.to(socket.id).emit('server:__playernumber__', roundArgs[pT.__map__.size - 1]);
			});
			socket.on('server:admin:__connect__', (data) => {
				socketIdAdmin = data;
			});

			socket.on('disconnect', () => {
				pT.leave(socket.id);
				if (socketIdAdmin === socket.id) socketIdAdmin = null;
				if (socketIdProjector === socket.id) socketIdProjector = null;
			});

			socket.on('server:showInputs', (data) => {
				const { __playernumber__ } = data;
				const i = __playernumber__ === player0 ? 0 : 1;

				io.to(socketIdAdmin!).emit('server:admin:showInputs', { i, value: data.value });
			});
		});

		// ###########################################################

		setInterval(() => {
			// if (pT.__map__.size === 0) console.log('Waiting for both players ...');
			// if (pT.__map__.size === 1) console.log('Waiting for the last player ...');

			console.log('Players:', pT.__map__);
		}, 1000);
	}
};

export default defineConfig({
	plugins: [sveltekit(), webSocketServer],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
