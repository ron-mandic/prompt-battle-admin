<script lang="ts">
	import { onMount } from 'svelte';
	import { Socket, io } from 'socket.io-client';
	import Autoscroll from '$lib/components/Autoscroll.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Counter from '$lib/components/Counter.svelte';

	// TODO: Server connection

	let areChoosing = true;
	let haveChosen = false;

	let challenge = 'Design a new product for the smallest target group (including you)!';
	let player0 = 'Marcel';
	let player1 = 'Alexander';

	let imgIndex = null;
	let imgPlayer0 = '';
	let imgPlayer1 = '';
</script>

<div
	id="prompt-screen"
	class="w-full h-full m-auto pt-[117px] pb-[103px] flex-col justify-between flex"
>
	<div class="grid w-full h-full">
		<div class="main relative">
			<div class="col-left pointer-events-none relative" class:opacity-30={imgIndex === 1}>
				{#if !imgPlayer0}
					<div class="loader absolute">
						<Loader />
					</div>
				{:else}
					<img src={imgPlayer0 || 'https://placehold.co/792'} width="792" height="792" alt="792" />
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
				<div id="player-score" class="w-full self-start mt-4" class:opacity-30={imgIndex !== null}>
					<p>current score:</p>
					<p class="flex w-full justify-between">
						<span class="inline-block flex-grow flex-[33%]">2</span>
						<span class="inline-block flex-grow flex-[33%]">-</span>
						<span class="inline-block flex-grow flex-[33%]">1</span>
					</p>
				</div>
			</div>
			<div class="col-right pointer-events-none relative" class:opacity-30={imgIndex === 0}>
				{#if !imgPlayer1}
					<div class="loader absolute">
						<Loader --delay={0.5} />
					</div>
				{:else}
					<img src={imgPlayer1 || 'https://placehold.co/792'} width="792" height="792" alt="792" />
				{/if}
			</div>
			<div class="footer">
				<div class="player-0 absolute left-[2px] bottom-[2px]" class:opacity-30={imgIndex === 1}>
					{player0}
				</div>
				<div class="player-1 absolute right-[2px] bottom-[2px]" class:opacity-30={imgIndex === 0}>
					{player1}
				</div>
			</div>
		</div>
	</div>
</div>

<Counter t0={0} tN={-2} end="Choose!" />

<style lang="scss">
	#prompt-screen .grid {
		grid-template-rows: 860px;
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
</style>
