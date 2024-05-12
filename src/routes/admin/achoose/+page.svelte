<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Socket, io } from 'socket.io-client';
	import IconCheck from '$lib/components/IconCheck.svelte';
	import { onMount } from 'svelte';

	const socket: Socket = io('http://localhost:3000', {
		reconnection: true
	});
	let player0: string;
	let player0Score: string;
	let player1: string;
	let player1Score: string;

	let dataGUUID: string;
	let mode: string;
	let srcImageA: string;
	let srcImageB: string;

	let haveChosen = false;

	onMount(() => {
		mode = $page.url.searchParams.get('mode')!;

		socket.on('connect', () => {
			socket
				.emit('c:initClient', 'ADMIN')
				.emit('a:requestEvent', 's:sendBattleData')
				.emit('a:requestEvent', 's:sendImage/results');
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
			}
		);
		socket.on('s:sendImage/results', ({ player0Image, player1Image }) => {
			srcImageA = 'data:image/png;base64,' + player0Image;
			srcImageB = 'data:image/png;base64,' + player1Image;
		});
	});
</script>

<div class="relative w-full debug h-full m-auto pt-[61px] pb-[42px] flex-col justify-between flex">
	<div class="top flex flex-col justify-start">
		<div class="players flex w-full px-[181px] items-center gap-[75px]">
			<div id="player-0">
				<div class="player py-[25px] relative">
					<span class="relative px-4">{player0}</span>
					<div class="absolute top-1/2 -left-24 -translate-x-1/2 -translate-y-1/2">
						<IconCheck />
					</div>
				</div>
				<div class="image-container flex items-center justify-center w-full h-[420px] mt-8">
					<div
						class="image"
						data-status="no"
						on:click|once={(e) => {
							if (haveChosen) return;

							const target = e.currentTarget;
							target.dataset.status = 'yes';
							haveChosen = true;

							socket.emit('a:sendBattleData/admin/achoose', {
								player0Score: (+player0Score + 1).toString(),
								player1Score
							});
							player0Score = (+player0Score + 1).toString();

							setTimeout(() => {
								goto(`/admin/next?${$page.url.searchParams.toString()}`); // ...&guuid=g-...
							}, 2000);
						}}
					>
						<img width="378" height="378" src={srcImageA} alt="" />
					</div>
				</div>
			</div>
			<div id="player-score" class="w-full self-start mt-4">
				<p>current score:</p>
				<p class="flex w-full justify-between">
					<span class="inline-block flex-grow flex-[33%]">{player0Score}</span>
					<span class="inline-block flex-grow flex-[33%]">-</span>
					<span class="inline-block flex-grow flex-[33%]">{player1Score}</span>
				</p>
			</div>
			<div id="player-1">
				<div class="player py-[25px] relative">
					<span class="relative px-4">{player1}</span>
					<div class="absolute top-1/2 -right-24 translate-x-1/2 -translate-y-1/2">
						<IconCheck />
					</div>
				</div>
				<div class="image-container flex items-center justify-center w-full h-[420px] mt-8">
					<div
						class="image"
						data-status="no"
						on:click|once={(e) => {
							if (haveChosen) return;

							const target = e.currentTarget;
							target.dataset.status = 'yes';
							haveChosen = true;

							socket.emit('a:sendBattleData/admin/achoose', {
								player0Score,
								player1Score: (+player1Score + 1).toString()
							});
							player1Score = (+player1Score + 1).toString();

							setTimeout(() => {
								goto(`/admin/next?${$page.url.searchParams.toString()}`); // ...&guuid=g-...
							}, 2000);
						}}
					>
						<img width="378" height="378" src={srcImageB} alt="" />
					</div>
				</div>
			</div>
		</div>
	</div>

	{#if !haveChosen}
		<p id="system-status" class="absolute w-full text-center bottom-[174px]">
			Audience is choosing
		</p>
	{:else}
		<p id="system-status" class="absolute chosen w-full text-center bottom-[174px]">
			Audience has chosen
		</p>
	{/if}

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

		&.chosen::after {
			content: '!';
			animation: none;
		}
	}

	.image-container {
		display: flex;
		flex-shrink: 0;

		.image {
			width: 420px;
			height: 420px;
			padding: 21px;
			aspect-ratio: 1/1;
			background: #1c1f22;
			border: 2px solid #6eebea;
			transition: opacity 0.3s ease-in-out;

			&[data-status='yes'] {
				border: 8px solid #6eebea;
			}
			&[data-status='no'] {
				opacity: 0.3;
				transition: opacity 1s ease-in-out;
			}
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
