<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { UNKNOWN, URL_SERVER } from '$lib/ts/constants';
	import { Socket, io } from 'socket.io-client';
	import { onMount } from 'svelte';

	const socket: Socket = io(URL_SERVER, {
		reconnection: true
	});
	let player0: string;
	let player0Score: string;
	let player1: string;
	let player1Score: string;
	let dataGUUID: string;

	let mode: string;
	let label = 'Players are prompting';

	onMount(() => {
		sessionStorage.clear();
		mode = $page.url.searchParams.get('mode')!;

		socket.on('connect', () => {
			socket.emit('c:initClient', 'ADMIN').emit('a:requestEvent', 's:sendBattleData');
		});
		socket.on('s:setPlayerNames', ({ playerName0, playerName1 }) => {
			player0 = playerName0;
			player1 = playerName1;
		});
		socket.on(
			's:sendBattleData',
			({ player0Score: _player0Score, player1Score: _player1Score, guuid }) => {
				player0Score = _player0Score;
				player1Score = _player1Score;
				dataGUUID = guuid;

				$page.url.searchParams.set('guuid', dataGUUID);
				goto(`?${$page.url.searchParams.toString()}`); // ...&guuid=g-...
			}
		);
		socket.on('s:sendRoute/prompt', () => {
			switch (mode) {
				case 'p':
					setTimeout(() => {
						goto(`/admin/pchoose?${$page.url.searchParams.toString()}`);
					}, 0); // 1000
					break;
				case 'ps':
					label = 'Players are scribbling';
					break;
			}
		});
		socket.on('s:sendRoute/scribble', () => {
			setTimeout(() => {
				goto(`/admin/pchoose?${$page.url.searchParams.toString()}`);
			}, 0); // 1000
		});

		return () => {
			sessionStorage.setItem('1', player0);
			sessionStorage.setItem('2', player1);
			socket.disconnect();
		};
	});
</script>

<svelte:head>
	<title>Admin - Main page</title>
</svelte:head>

<div class="relative w-full h-full m-auto pt-[61px] pb-[42px] flex-col justify-between flex">
	<div class="top flex flex-col items-start">
		<div class="players flex w-full px-[181px] items-center gap-[75px]">
			<div id="player-0" class="player py-[25px]">
				<span class="relative px-4">{player0}</span>
			</div>
			<div id="player-score" class="w-full">
				<p>current score:</p>
				<p class="flex w-full justify-between">
					<span class="inline-block flex-grow flex-[33%]"
						>{player0Score === undefined ? UNKNOWN : player0Score}</span
					>
					<span class="inline-block flex-grow flex-[33%]">-</span>
					<span class="inline-block flex-grow flex-[33%]"
						>{player1Score === undefined ? UNKNOWN : player1Score}</span
					>
				</p>
			</div>
			<div id="player-1" class="player py-[25px]">
				<span class="relative px-4">{player1}</span>
			</div>
		</div>
	</div>

	<p id="system-status" class="absolute w-full text-center bottom-[174px]">{label}</p>

	<div class="footer absolute bottom-0 w-full flex justify-between items-center">
		<button id="btn-restart">restart round</button>
		<button id="btn-quit">force quit</button>
	</div>
</div>

<style lang="scss">
	.player {
		display: flex;
		width: 580px;
		height: 156px;
		justify-content: center;
		align-items: flex-start;
		border: 2px solid #9c9c9c;
		background: #1c1f22;

		span {
			color: #fff;
			text-align: center;
			font-size: 80px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
			// min-width: 1px;
			// height: 106px;

			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	#player-score {
		width: 250px;
		height: 124px;
		border: 2px solid #6eebea;
		background: #1c1f22;
		padding: 0 0.75rem;

		p:nth-child(1) {
			color: #fff;
			text-align: center;
			font-size: 24px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
		}

		p:nth-child(2) {
			color: #fff;
			text-align: center;
			font-size: 68px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
		}
	}

	#system-status {
		color: #fff;
		text-align: center;
		font-size: 80px;
		font-style: normal;
		font-weight: 700;
		line-height: normal;

		&::after {
			content: '.';
			animation: loading 6s infinite ease-in-out;
			display: inline-block;
		}
	}

	.footer {
		position: absolute;
		bottom: 0;
		width: 100%;
		padding: 23px 42px;

		button {
			background: #1c1f22;
			text-align: center;
			font-size: 43.33px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
			padding: 11.214px 16.544px 11.786px 16.456px;
		}

		#btn-restart {
			color: #ffe500;
			border: 1.083px solid #ffe500;
		}

		#btn-quit {
			color: #f00;
			border: 1.083px solid #f00;
		}
	}

	@keyframes loading {
		0%,
		100% {
			content: '';
		}
		25% {
			content: '.';
		}
		50% {
			content: '..';
		}
		75% {
			content: '...';
		}
	}

	@keyframes blink {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
