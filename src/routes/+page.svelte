<script lang="ts">
	import { TEXT_H1, URL_SERVER } from '$lib/ts/constants';
	import { onMount } from 'svelte';
	import { Socket, io } from 'socket.io-client';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	const socket: Socket = io(URL_SERVER, {
		reconnection: true
	});
	let player0 = '';
	let player0IsReady = false;
	let player1 = '';
	let player1IsReady = false;
	let mode: string;
	let hasStarted = false;

	onMount(() => {
		socket.on('connect', () => {
			socket.emit('c:initClient', 'ADMIN');
		});
		socket.on('s:setPlayerNames', ({ playerName0, playerName1 }) => {
			player0 = playerName0;
			player1 = playerName1;
		});
		socket.on('s:setPlayerReadiness', (id) => {
			console.log('Player', id, 'is ready');

			if (id == '1') player0IsReady = true;
			if (id == '2') player1IsReady = true;
		});

		return () => {
			player0IsReady = false;
			player1IsReady = false;
			hasStarted = false;
			socket.disconnect();
		};
	});

	function handleButtonP() {
		mode = 'p';
		socket.emit('a:setMode', { mode, isNew: true });
		$page.url.searchParams.set('mode', mode);

		hasStarted = true;
	}

	function handleButtonPS() {
		mode = 'ps';
		socket.emit('a:setMode', { mode, isNew: true });
		$page.url.searchParams.set('mode', mode);

		hasStarted = true;
	}

	$: if (hasStarted && mode) {
		socket.emit('a:setProjector/projector/');

		setTimeout(() => {
			goto(`/admin?mode=${mode}`);
		}, 0); // 1000
	}
</script>

<svelte:head>
	<title>Server</title>
</svelte:head>

<div class="w-full h-full m-auto pt-[61px] pb-[42px] flex-col justify-between flex">
	<div class="top">
		<h1 class="uppercase text-center w-full">{@html TEXT_H1}</h1>
		<div class="players flex w-full px-[181px] items-center gap-[75px]">
			<div id="player-0" class="player py-[25px]">
				<span class="relative px-4" class:ready={player0IsReady}>{player0}</span>
			</div>
			<div class="vs">vs</div>
			<div id="player-1" class="player py-[25px]">
				<span class="relative px-4" class:ready={player1IsReady}>{player1}</span>
			</div>
		</div>
	</div>
	<div class="bottom flex flex-col items-center gap-[28px]">
		<button
			class="link-button flex flex-col"
			class:disabled={!player0IsReady || !player1IsReady}
			class:opacity-30={mode && mode === 'ps'}
			on:click={handleButtonP}
		>
			<div class="flex-col flex items-center mt-[8px]">
				<span class="text">start</span>
				<span class="text-addition">(Prompt only)</span>
			</div>
		</button>
		<button
			class="link-button flex flex-col"
			class:disabled={!player0IsReady || !player1IsReady}
			class:opacity-30={mode && mode === 'p'}
			on:click={handleButtonPS}
		>
			<div class="flex-col flex items-center mt-[8px]">
				<span class="text">start</span>
				<span class="text-addition">(Prompt & Scribble)</span>
			</div>
		</button>
	</div>
</div>

<style lang="scss">
	h1 {
		color: #fff;
		font-size: 170px;
		font-style: normal;
		line-height: normal;
	}

	.vs {
		color: #fff;
		text-align: center;
		font-family: 'JetBrains Mono';
		font-size: 80px;
		font-style: normal;
		font-weight: 300;
		line-height: normal;
		width: 248px;
	}

	.player {
		display: flex;
		width: 580px;
		height: 156px;
		justify-content: center;
		align-items: flex-start;
		border: 2px solid #9c9c9c;
		background: #1c1f22;

		&:has(span.ready) {
			border: 2px solid rgb(68, 216, 68);
			background-color: hsl(120, 57%, 12%);
		}

		span {
			color: #fff;
			text-align: center;
			font-family: 'JetBrains Mono';
			font-size: 80px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
			// min-width: 1px;
			// height: 106px;

			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;

			&:not(.ready)::after {
				content: '';
				position: absolute;
				right: 0;
				display: inline-block;
				background-color: #fff;
				vertical-align: top;
				width: 4px;
				height: 106px;
				-webkit-animation: blink 1s ease-in-out infinite;
				animation: blink 1s ease-in-out infinite;
				border: none;
				translate: -0.5rem 0;
			}
		}
	}

	button {
		all: unset;
	}

	button.disabled {
		cursor: not-allowed;
		pointer-events: none;
		opacity: 0.3;
	}

	.link-button {
		width: 774px;
		height: 200px;
		border: 2px solid #6eebea;
		background: #1c1f22;
		padding: 1px 0 0.5rem;

		&.opacity-30 {
			opacity: 0.3;
		}

		.text {
			color: #6eebea;
			text-align: center;
			font-size: 80px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
		}

		.text-addition {
			color: #6eebea;
			font-size: 50px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
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
