<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
	import { Socket, io } from 'socket.io-client';
	import { timer, time, isRunning, isComplete, resetTimer } from '$lib/stores/timer-prompt';
	import Counter from '$lib/components/Counter.svelte';
	import Autoscroll from '$lib/components/Autoscroll.svelte';
	import AutoscrollChallenge from '$lib/components/AutoscrollChallenge.svelte';
	import { UNKNOWN, URL_SERVER } from '$lib/ts/constants';

	const socket: Socket = io(URL_SERVER, {
		reconnection: true
	});

	let hasStarted = false;
	let dataPrompt: string;
	let player0: string;
	let player0Score: string;
	let player1Score: string;
	let player1: string;
	let player0Prompt = '';
	let player1Prompt = '';

	let mode: string;

	onMount(() => {
		socket.on('connect', () => {
			socket
				.emit('c:initClient', 'PROJECTOR')
				.emit('p:requestEvent', 's:sendPromptBattle')
				.emit('p:requestEvent', 's:sendMode');
		});
		socket.on('s:setPlayerNames', ({ playerName0, playerName1 }) => {
			player0 = playerName0;
			player1 = playerName1;
		});
		socket.on('s:sendMode', (_mode) => {
			mode = _mode;
			$page.url.searchParams.set('mode', mode);
			goto(`?${$page.url.searchParams.toString()}`); // ...?mode=...
		});
		socket.on(
			's:sendPromptBattle',
			({
				player0: name0,
				player1: name1,
				player0Score: score0,
				player1Score: score1,
				prompts,
				currentRound
			}) => {
				player0 = name0;
				player1 = name1;
				player0Score = score0;
				player1Score = score1;
				dataPrompt = prompts[currentRound - 1];
			}
		);
		socket.on('s:sendClientPrompt', ({ id, value }) => {
			if (id === '1') player0Prompt = value;
			if (id === '2') player1Prompt = value;
		});

		setTimeout(() => {
			hasStarted = true;
		}, 0); // 2750
	});

	onDestroy(() => {
		resetTimer();
	});

	$: if ($isComplete) {
		setTimeout(async () => {
			$isRunning = false;
			$isComplete = false;
			timer.reset();

			switch (mode) {
				case 'ps': {
					goto(`/projector/scribble?${$page.url.searchParams.toString()}`);
					break;
				}
				case 'p': {
					goto(`/projector/results?${$page.url.searchParams.toString()}`);
					break;
				}
			}
		}, 0); // 2000
	}
</script>

<svelte:head>
	<title>Projector - Prompt</title>
</svelte:head>

{#if !hasStarted}
	<div id="challenge-overlay" class="fixed h-screen w-screen flex flex-col items-center gap-[14px]">
		<h1>Challenge:</h1>
		<AutoscrollChallenge innerText={dataPrompt} --padding-bottom="56px" />
	</div>
{/if}

<div
	id="prompt-screen"
	class="w-full h-full m-auto pt-[84px] pb-[103px] flex-col justify-between flex"
>
	<div class="grid w-full h-full">
		<div class="header relative" class:opacity-0={!hasStarted}>
			<Autoscroll
				route="prompt-header"
				innerText={dataPrompt || UNKNOWN}
				disableScrollbar
				constrainOverflowBy={46}
				--padding="20px 20px 56px"
			/>
			<div class="label absolute left-0 bottom-0">Challenge</div>
		</div>
		<div class="main relative">
			<div class="col-left">
				<Autoscroll route="prompt-main" innerText={player0Prompt} --padding-bottom="56px" />
			</div>
			<div class="col-mid flex flex-col justify-between items-center">
				<div id="prompt-clock" class="flex flex-col justify-center">
					<p>time remaining:</p>
					<p
						class:completing={+$time.slice(3) <= 10 && $time[1] !== '1'}
						class:complete={$isComplete}
					>
						{$time}
					</p>
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
			</div>
			<div class="col-right">
				<Autoscroll route="prompt-main" innerText={player1Prompt} --padding-bottom="56px" />
			</div>
			<div class="footer">
				<div class="absolute left-0 bottom-0 px-2">{player0 || sessionStorage?.getItem('1')}</div>
				<div class="absolute right-0 bottom-0 px-2">{player1 || sessionStorage?.getItem('2')}</div>
			</div>
		</div>
	</div>
</div>

{#if hasStarted}
	<Counter
		t0={3}
		onEnd={() => {
			timer.start();
			document.querySelectorAll('.marquee').forEach((marquee) => {
				marquee.classList.add('fade');
			});
		}}
	/>
{/if}

<style lang="scss">
	#challenge-overlay {
		position: fixed;
		padding-top: 117px;
		flex-shrink: 0;
		background: rgba(0, 0, 0, 0.875);
		z-index: 190;

		h1 {
			padding: 21px 27px;
			width: 774px;
			height: 200px;
			width: fit-content;
			border: 2px solid #6eebea;
			background: #1c1f22;
			color: #fff;
			text-align: center;
			font-size: 120px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
		}
	}

	#prompt-screen .grid {
		grid-template-rows: 200px 646px;
		row-gap: 47px;
	}

	:global(.label) {
		width: 260px;
		height: 51px;
		flex-shrink: 0;
		border-top: 2px solid #6eebea;
		border-right: 2px solid #6eebea;
		color: #fff;
		text-align: center;
		font-size: 36px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		background-color: #1c1f22;
		z-index: 2;
	}

	.header,
	.main {
		width: 1888px;
		margin: 0 auto;
	}

	.header {
		height: 200px;
		flex-shrink: 0;
		border: 2px solid #6eebea;
		background: #1c1f22;
		z-index: 999;
	}

	.main {
		display: grid;
		grid-template-columns: 808px 240px 808px;
		grid-template-rows: 1fr;
		column-gap: 1rem;

		.col-left,
		.col-right {
			border: 2px solid #6eebea;
			background: #1c1f22;
			max-height: 646px;
		}

		.col-mid {
			#prompt-clock {
				width: 245px;
				height: 124px;
				flex-shrink: 0;
				background: #1c1f22;
				padding: 8px 12px 0;
				border: 2px solid #6eebea;
				background: #1c1f22;

				p:nth-child(1) {
					color: #fff;
					text-align: center;
					font-family: 'JetBrains Mono';
					font-size: 24px;
					font-style: normal;
					font-weight: 400;
					line-height: normal;
				}

				p:nth-child(2) {
					color: #fff;
					text-align: center;
					font-family: 'JetBrains Mono';
					font-size: 68px;
					font-style: normal;
					font-weight: 400;
					line-height: normal;

					&.completing {
						animation: pulse 0.75s linear infinite;
					}

					&.complete {
						color: #ff3838;
						animation: shakeX 1s linear;
					}
				}
			}

			#player-score {
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
		}

		.footer {
			div {
				width: 260px;
				height: 51px;
				flex-shrink: 0;
				color: #fff;
				text-align: center;
				font-size: 36px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
				z-index: 2;
				border: 2px solid #6eebea;
				background-color: #1c1f22;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}

	@keyframes autoscroll {
		0% {
			transform: translateY(0%);
		}
		50%,
		100% {
			transform: translateY(-100%);
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

	@keyframes pulse {
		from {
			transform: scale3d(1, 1, 1);
		}

		50% {
			transform: scale3d(1.05, 1.05, 1.05);
		}

		to {
			transform: scale3d(1, 1, 1);
		}
	}

	@keyframes shakeX {
		from,
		to {
			transform: translate3d(0, 0, 0);
		}

		10%,
		30%,
		50%,
		70%,
		90% {
			transform: translate3d(-10px, 0, 0);
		}

		20%,
		40%,
		60%,
		80% {
			transform: translate3d(10px, 0, 0);
		}
	}
</style>
