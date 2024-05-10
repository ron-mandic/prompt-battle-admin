<script lang="ts">
	import { onMount } from 'svelte';
	import { Socket, io } from 'socket.io-client';
	import Autoscroll from '$lib/components/Autoscroll.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Counter from '$lib/components/Counter.svelte';
	import Banner from '$lib/components/Banner.svelte';
	import { EBannerText } from '$lib/ts/enums';
	import { Confetti } from 'svelte-confetti';

	// TODO: Server connection

	const MAX_ROUNDS = 3;
	let areChoosing = false;
	let haveChosen = false;
	let isRegistered = true;

	let challenge = 'Design a new product for the smallest target group (including you)!';
	let player0 = 'Marcel';
	let player1 = 'Alexander';

	let showOverlay = false;
	let showOverlayFinal = false;
	let showNextRound = false;

	let imgIndex = 0;
	let imgPlayer0 = 'https://placehold.co/792';
	let imgPlayer1 = '';
	let scorePlayer0 = 1;
	let scorePlayer1 = 1;
	let visiblePlayer0 = false;
	let visiblePlayer1 = false;

	const getWinner = () => {
		if (scorePlayer0 + scorePlayer1 < MAX_ROUNDS) {
			return;
		}

		if (scorePlayer0 > scorePlayer1) {
			return player0;
		} else if (scorePlayer1 > scorePlayer0) {
			return player1;
		}
	};

	$: if (imgPlayer0 && imgIndex !== null && !visiblePlayer0) {
		setTimeout(() => {
			visiblePlayer0 = true;
			setTimeout(() => {
				showOverlay = true;
				setTimeout(() => {
					scorePlayer0++;
				}, 3000);
			}, 3000);
		}, 3000);
	}

	$: if (imgPlayer1 && imgIndex !== null && !visiblePlayer1) {
		setTimeout(() => {
			visiblePlayer1 = true;
			setTimeout(() => {
				showOverlay = true;
				setTimeout(() => {
					scorePlayer1++;
				}, 3000);
			}, 3000);
		}, 3000);
	}

	$: if (showOverlay) {
		setTimeout(() => {
			let isDecided = scorePlayer0 + scorePlayer1 === MAX_ROUNDS;

			if (isDecided) {
				showOverlayFinal = true;
				setTimeout(() => {
					showNextRound = true;
				}, 6000);
			} else {
				setTimeout(() => {
					showNextRound = true;
				}, 3000);
			}
		}, 6000);
	}
</script>

<div
	id="prompt-screen"
	class="w-full h-full m-auto pt-[117px] pb-[103px] flex-col justify-between flex"
>
	<div class="grid w-full h-full">
		<div class="main relative">
			<div
				class="col-left pointer-events-none relative"
				class:opacity-30={imgIndex === 1 && !showOverlay}
				class:opacity-0={imgIndex === 1 && showOverlay}
			>
				{#if !imgPlayer0}
					<div class="loader absolute">
						<Loader />
					</div>
				{:else}
					<img src={imgPlayer0 || 'https://placehold.co/792'} width="792" height="792" alt="792" />
					{#if visiblePlayer0}
						<div
							class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
						>
							<Confetti
								x={[-3, 3]}
								y={[-5, 5]}
								xSpread={0.25}
								size={30}
								duration={3500}
								amount={250}
								fallDistance="400px"
								colorArray={['#ED3A4F', '#0091B5', '#FDB913']}
							/>
						</div>
					{/if}
				{/if}
			</div>
			<div class="col-mid flex flex-col justify-between items-center">
				<div
					id="prompt-prompt"
					class="flex flex-col items-start overflow-hidden"
					class:opacity-0={imgIndex !== null}
				>
					<div class="prompter overflow-hidden">
						<Autoscroll route="results" innerText={challenge} disableScrollbar />
					</div>
					<div class="label w-full h-[16px]">Challenge</div>
				</div>
				{#if !areChoosing}
					<div
						id="prompt-clock"
						class="flex flex-col justify-center mt-[6px]"
						class:opacity-0={imgIndex !== null}
					>
						<p>time remaining:</p>
						<p>01:00</p>
					</div>
				{:else}
					<div
						id="prompt-command"
						class="flex flex-col justify-center mt-[6px]"
						class:opacity-0={imgIndex !== null}
					>
						<span class="w-full text-center block">Choose!</span>
					</div>
				{/if}
				<div
					id="player-score"
					class="w-full self-start mt-4"
					class:opacity-30={imgIndex !== null && !showOverlay}
					class:opacity-0={imgIndex !== null && showOverlay}
					class:translate-a={imgIndex !== null && showOverlay && showOverlayFinal && !showNextRound}
					class:translate-b={imgIndex !== null && showOverlay && showNextRound}
					class:mid-overlay={imgIndex !== null &&
						showOverlay &&
						(showOverlayFinal || showNextRound)}
				>
					<p>current score:</p>
					<p class="flex w-full justify-between">
						<span class="inline-block flex-grow flex-[33%]">{scorePlayer0}</span>
						<span class="inline-block flex-grow flex-[33%]">-</span>
						<span class="inline-block flex-grow flex-[33%]">{scorePlayer1}</span>
					</p>
				</div>
			</div>
			<div
				class="col-right pointer-events-none relative"
				class:opacity-30={imgIndex === 0 && !showOverlay}
				class:opacity-0={imgIndex === 0 && showOverlay}
			>
				{#if !imgPlayer1}
					<div class="loader absolute">
						<Loader --delay={0.5} />
					</div>
				{:else}
					<img src={imgPlayer1 || 'https://placehold.co/792'} width="792" height="792" alt="792" />
					{#if visiblePlayer1}
						<div
							class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
						>
							<Confetti
								x={[-3, 3]}
								y={[-5, 5]}
								xSpread={0.25}
								size={30}
								duration={3500}
								amount={250}
								fallDistance="400px"
								colorArray={['#ED3A4F', '#0091B5', '#FDB913']}
							/>
						</div>
					{/if}
				{/if}
			</div>
			<div class="footer">
				<div
					class="player-0 absolute left-[2px] bottom-[2px] px-2"
					class:opacity-30={imgIndex === 1 && !showOverlay}
					class:opacity-0={imgIndex === 1 && showOverlay}
				>
					{player0}
				</div>
				<div
					class="player-1 absolute right-[2px] bottom-[2px] px-2"
					class:opacity-30={imgIndex === 0 && !showOverlay}
					class:opacity-0={imgIndex === 0 && showOverlay}
				>
					{player1}
				</div>
			</div>
		</div>
	</div>
</div>

<div
	class:opacity-0={!showOverlay}
	class="fixed h-screen w-screen"
	style="background: rgba(0, 0, 0, 0.875);"
/>

{#if areChoosing}
	<Counter t0={0} tN={-2} --width="1632px">
		<p class="counter-p-1" slot="noblink">Audience:</p>
		<p class="counter-p-2" slot="blink">Choose!</p>
	</Counter>
{/if}

{#if showOverlay && !showOverlayFinal && !showNextRound}
	<div id="prompt-overlay" class="fixed flex justify-center items-center h-screen w-screen">
		<div class="row flex justify-between items-center">
			<div class="player player-0 flex justify-center items-center px-4">
				<span class="w-full">{player0}</span>
			</div>
			<div id="player-score" class="overlay w-full self-start" class:score={isRegistered}>
				<p class="pt-[15px] h-[60px]">current score:</p>
				<p class="flex w-full justify-between">
					<span class="inline-block flex-grow flex-[33%]">{scorePlayer0}</span>
					<span class="inline-block flex-grow flex-[33%]">-</span>
					<span class="inline-block flex-grow flex-[33%]">{scorePlayer1}</span>
				</p>
			</div>
			<div class="player player-0 flex justify-center items-center px-4">
				<span class="w-full">{player1}</span>
			</div>
		</div>
	</div>
{/if}

{#if showOverlay && showOverlayFinal && !showNextRound}
	<Counter
		t0={0}
		tN={-1000}
		--width="1632px"
		--height="573px"
		--translate-y="-95px"
		--background-overlay="transparent"
	>
		<p class="counter-p-1 uppercase" style="font-size: 100px; color: white;" slot="noblink">
			Winner:
		</p>
		<p class="counter-p-2 uppercase overflow-hidden text-ellipsis whitespace-nowrap" slot="blink">
			<span class="w-full px-12">{getWinner()}</span>
		</p>
	</Counter>
	<div class="fixed h-screen w-screen flex justify-center items-center" style="z-index: 1000;">
		<Confetti
			x={[-5, 5]}
			y={[-5, 5]}
			xSpread={0.25}
			delay={[0, 1000]}
			size={30}
			duration={3500}
			amount={250}
			fallDistance="400px"
			colorArray={['#ED3A4F', '#0091B5', '#FDB913']}
		/>
	</div>
{/if}

{#if showNextRound}
	<Banner innerText={EBannerText.ROUND} --background-overlay="transparent" />
{/if}

<style lang="scss">
	#prompt-screen .grid {
		grid-template-rows: 860px;
	}

	#prompt-overlay {
		.row {
			transform: translateY(-5px);
			column-gap: 25px;

			.player {
				width: 580px;
				height: 156px;
				border: 2px solid #6eebea;
				background: #1c1f22;
				color: #fff;
				text-align: center;
				font-size: 80px;
				font-style: normal;
				font-weight: 700;
				line-height: normal;

				span {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}

	#player-score {
		height: 124px;
		border: 2px solid #6eebea;
		background: #1c1f22;
		padding: 0 0.75rem;

		// .col-mid
		&.mid-overlay {
			opacity: 100;
			z-index: 999;
			transition: translate 0.5s cubic-bezier(0.445, 0.05, 0.55, 0.95);

			&.translate-a {
				translate: 0 -62px;
			}

			&.translate-b {
				translate: 0 -109px;
			}
		}

		&.overlay {
			width: 440px;
			height: 230px;
			flex-shrink: 0;

			&.score {
				animation-name: pulse;
				animation-duration: 0.75s;
				animation-timing-function: ease-in-out;
				animation-delay: 2.675s;
			}

			p:nth-child(1) {
				color: #fff;
				text-align: center;
				font-size: 44.129px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
			}

			p:nth-child(2) {
				color: #fff;
				text-align: center;
				font-size: 125.032px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
			}
		}

		&:not(.overlay) {
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

	.label {
		border-top: 2px solid #6eebea;
		color: #fff;
		text-align: center;
		font-size: 36px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		background-color: #1c1f22;
		z-index: 2;
	}

	.counter-p-1 {
		color: #6eebea;
		text-align: center;
		font-size: 75px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
	}

	.counter-p-2 {
		color: #fff;
		text-align: center;
		font-size: 247.95px;
		font-style: normal;
		font-weight: 700;
		line-height: normal;
	}

	.main {
		display: grid;
		width: 1888px;
		margin: 0 auto;
		grid-template-columns: 808px 240px 808px;
		grid-template-rows: 1fr;
		column-gap: 1rem;

		.col-left,
		.col-right {
			border: 2px solid #6eebea;
			background: #1c1f22;
			padding: 0.5rem;

			.loader {
				scale: 1;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}
		}

		.col-mid {
			#prompt-prompt {
				border: 2px solid #6eebea;
				background: #1c1f22;
				width: 240px;
				height: 260px;

				.prompter {
					max-height: 202px;
				}
			}
			#prompt-clock,
			#prompt-command {
				width: 245px;
				height: 124px;
				flex-shrink: 0;
				background: #1c1f22;
				padding: 8px 12px 0;
				border: 2px solid #6eebea;
				background: #1c1f22;
			}
			#prompt-command {
				align-items: center;
				color: #fff;
				font-size: 54px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
				padding: 26px 4px 27px 9px;
			}
			#prompt-clock {
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
				z-index: 0;
				background-color: #1c1f22;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;

				&.player-0 {
					border-top: 2px solid #6eebea;
					border-right: 2px solid #6eebea;
				}

				&.player-1 {
					border-top: 2px solid #6eebea;
					border-left: 2px solid #6eebea;
				}
			}
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

	@keyframes heartBeat {
		0% {
			transform: scale(1);
		}

		14% {
			transform: scale(1.3);
		}

		28% {
			transform: scale(1);
		}

		42% {
			transform: scale(1.3);
		}

		70% {
			transform: scale(1);
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
