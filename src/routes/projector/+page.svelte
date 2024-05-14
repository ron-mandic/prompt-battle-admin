<script lang="ts">
	import { TEXT_H1, URL_SERVER } from '$lib/ts/constants';
	import { goto } from '$app/navigation';
	import { Socket, io } from 'socket.io-client';
	import { onMount } from 'svelte';

	const socket: Socket = io(URL_SERVER, {
		reconnection: true
	});
	let player0: string;
	let player1: string;
	let player0IsReady = false;
	let player1IsReady = false;

	onMount(() => {
		sessionStorage.clear();

		socket.on('connect', () => {
			socket.emit('c:initClient', 'PROJECTOR');
		});
		socket.on('s:setPlayerNames', ({ playerName0, playerName1 }) => {
			player0 = playerName0;
			player1 = playerName1;
		});
		socket.on('s:setProjector/projector/', () => {
			setTimeout(() => {
				goto('/projector/prompt/');
			}, 0); // 1000
		});
		socket.on('s:setPlayerReadiness', (id) => {
			console.log('Player', id, 'is ready');

			if (id == '1') player0IsReady = true;
			if (id == '2') player1IsReady = true;
		});

		return () => {
			player0IsReady = false;
			player1IsReady = false;
			sessionStorage.setItem('1', player0);
			sessionStorage.setItem('2', player1);
			socket.disconnect();
		};
	});
</script>

<svelte:head>
	<title>Projector - Main page</title>
</svelte:head>

<div class="w-full h-full m-auto pt-[61px] pb-[42px] flex-col justify-between flex">
	<div class="top h-screen flex flex-col justify-center">
		<h1 class="uppercase text-center w-full">{@html TEXT_H1}</h1>
		<div class="players flex w-full px-[181px] items-center gap-[75px]">
			<div id="player-0" class="player py-[25px]">
				<span class="relative px-4" class:ready={player0IsReady}>{player0 || ''}</span>
			</div>
			<div class="vs">vs</div>
			<div id="player-1" class="player py-[25px]">
				<span class="relative px-4" class:ready={player1IsReady}>{player1 || ''}</span>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.top {
		margin-top: -148px;
	}

	h1 {
		color: #fff;
		font-size: 170px;
		font-style: normal;
		line-height: 1;
		margin-bottom: 107px;
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
