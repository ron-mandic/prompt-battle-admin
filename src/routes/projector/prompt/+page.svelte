<script lang="ts">
	import { onMount } from 'svelte';
	import { Socket, io } from 'socket.io-client';
	import Counter from '$lib/components/Counter.svelte';
	import Autoscroll from '$lib/components/Autoscroll.svelte';
	import AutoscrollChallenge from '$lib/components/AutoscrollChallenge.svelte';
	import { fade } from 'svelte/transition';

	// TODO: Server connection

	let hasStarted = false;
	let challenge = 'Design a new product for the smallest target group (including you)!';
	let player0 = 'Marcel';
	let player1 = 'Alexander';
	let player0Prompt = '...';
	let player1Prompt = '...';

	onMount(() => {
		setTimeout(() => {
			hasStarted = true;
		}, 5000);
	});
</script>

{#if !hasStarted}
	<div id="challenge-overlay" class="fixed h-screen w-screen flex flex-col items-center gap-[14px]">
		<h1>Challenge:</h1>
		<AutoscrollChallenge innerText={challenge} --padding-bottom="56px" />
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
				innerText={challenge}
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
					<p>01:00</p>
				</div>
				<div id="player-score" class="w-full self-start mt-4">
					<p>current score:</p>
					<p class="flex w-full justify-between">
						<span class="inline-block flex-grow flex-[33%]">2</span>
						<span class="inline-block flex-grow flex-[33%]">-</span>
						<span class="inline-block flex-grow flex-[33%]">1</span>
					</p>
				</div>
			</div>
			<div class="col-right">
				<Autoscroll route="prompt-main" innerText={player1Prompt} --padding-bottom="56px" />
			</div>
			<div class="footer">
				<div class="absolute left-0 bottom-0 px-2">{player0}</div>
				<div class="absolute right-0 bottom-0 px-2">{player1}</div>
			</div>
		</div>
	</div>
</div>

{#if hasStarted}
	<Counter
		onEnd={() => {
			console.log('Started!');
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
</style>
