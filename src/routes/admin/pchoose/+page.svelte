<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { Socket, io } from 'socket.io-client';
	import { onMount } from 'svelte';
	import ImageThumbnail from '$lib/components/ImageThumbnail.svelte';
	import IconCross from '$lib/components/IconCross.svelte';
	import IconCheck from '$lib/components/IconCheck.svelte';
	import { UNKNOWN, URL_SERVER } from '$lib/ts/constants';

	const socket: Socket = io(URL_SERVER, {
		reconnection: true
	});
	let player0: string;
	let player0Score: string;
	let player1: string;
	let player1Score: string;
	let dataGUUID: string;

	let mode: string;
	let playerNumberA: string | undefined;
	let playerNumberB: string | undefined;
	let imageIndexA: string | undefined;
	let imageIndexB: string | undefined;
	let boolA = false;
	let boolB = false;

	onMount(() => {
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
		socket.on('s:sendImageInfo/results', ({ id, imageIndex: _imageIndex }) => {
			if (id === '1') {
				playerNumberA = id;
				imageIndexA = _imageIndex;
				boolA = true;
			}
			if (id === '2') {
				playerNumberB = id;
				imageIndexB = _imageIndex;
				boolB = true;
			}
		});

		return () => {
			playerNumberA = undefined;
			playerNumberB = undefined;
			imageIndexA = undefined;
			imageIndexB = undefined;
			boolA = false;
			boolB = false;
			socket.disconnect();
		};
	});

	$: if (boolA && boolB) {
		setTimeout(() => {
			goto(`/admin/achoose?${$page.url.searchParams.toString()}`); // ...&guuid=g-...
		}, 0); // 1000
	}
</script>

<svelte:head>
	<title>Admin - Players choose</title>
</svelte:head>

<div class="relative w-full h-full m-auto pt-[61px] pb-[42px] flex-col justify-between flex">
	<div class="top flex flex-col justify-start">
		<div class="players flex w-full px-[181px] items-center gap-[75px]">
			<div id="player-0">
				<div class="player py-[25px] relative">
					<span class="relative px-4">{player0 || sessionStorage?.getItem('1')}</span>
					{#if boolA}
						<div
							class="absolute top-1/2 -left-24 -translate-x-1/2 -translate-y-1/2"
							transition:scale={{
								duration: 500,
								delay: 500,
								opacity: 0,
								start: 0.125,
								easing: quintOut
							}}
						>
							<IconCheck />
						</div>
					{:else}
						<div
							class="absolute top-1/2 -left-24 -translate-x-1/2 -translate-y-1/2"
							transition:scale={{
								duration: 500,
								delay: 500,
								opacity: 0,
								start: 0.125,
								easing: quintOut
							}}
						>
							<IconCross />
						</div>
					{/if}
				</div>
				<div class="image-thumbnails flex justify-between items-center pt-16">
					<ImageThumbnail
						chosen={playerNumberA === '1' && imageIndexA !== undefined && +imageIndexA === 0}
					/>
					<ImageThumbnail
						chosen={playerNumberA === '1' && imageIndexA !== undefined && +imageIndexA === 1}
					/>
					<ImageThumbnail
						chosen={playerNumberA === '1' && imageIndexA !== undefined && +imageIndexA === 2}
					/>
				</div>
			</div>
			<div id="player-score" class="w-full self-start mt-4">
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
			<div id="player-1">
				<div class="player py-[25px] relative">
					<span class="relative px-4">{player1 || sessionStorage?.getItem('2')}</span>
					{#if boolB}
						<div
							class="absolute top-1/2 -right-24 translate-x-1/2 -translate-y-1/2"
							transition:scale={{
								duration: 500,
								delay: 500,
								opacity: 0,
								start: 0.125,
								easing: quintOut
							}}
						>
							<IconCheck />
						</div>
					{:else}
						<div
							class="absolute top-1/2 -right-24 translate-x-1/2 -translate-y-1/2"
							transition:scale={{
								duration: 500,
								delay: 500,
								opacity: 0,
								start: 0.125,
								easing: quintOut
							}}
						>
							<IconCross />
						</div>
					{/if}
				</div>
				<div class="image-thumbnails flex justify-between items-center pt-16">
					<ImageThumbnail
						chosen={playerNumberB === '2' && imageIndexB !== undefined && +imageIndexB === 0}
					/>
					<ImageThumbnail
						chosen={playerNumberB === '2' && imageIndexB !== undefined && +imageIndexB === 1}
					/>
					<ImageThumbnail
						chosen={playerNumberB === '2' && imageIndexB !== undefined && +imageIndexB === 2}
					/>
				</div>
			</div>
		</div>
	</div>

	<p id="system-status" class="absolute w-full text-center bottom-[174px]">Players are choosing</p>

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
