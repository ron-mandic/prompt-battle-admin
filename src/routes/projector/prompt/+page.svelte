<script lang="ts">
	import { TEXT_H1 } from '$lib/ts/constants';
	import { onMount } from 'svelte';
	import { Socket, io } from 'socket.io-client';

	// TODO: Server connection

	let loop: NodeJS.Timeout;
	let challenge = 'Design a new product for the smallest target group (including you)!';
	let player0 = 'Marcel';
	let player1 = 'Alexander';
	let player0Prompt = '...';
	let player1Prompt = '...';

	let refColLeft: HTMLDivElement, refColRight: HTMLDivElement;
	let refColLeftText: string, refColRightText: string;
	let overflowsLeft = false;
	let overflowsRight = false;

	onMount(() => {
		document.querySelectorAll('.marquee').forEach((marquee) => {
			marquee.classList.add('fade');
		});

		return () => clearInterval(loop);
	});

	function autoscroll(ref: HTMLElement) {
		loop = setInterval(function () {
			scrollToBottom(ref);

			setTimeout(function () {
				scrollToTop(ref);
			}, 2000);
		}, 4000);
	}

	function scrollToTop(ref: HTMLElement) {
		ref?.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}
	function scrollToBottom(ref: HTMLElement) {
		ref?.scrollTo({
			top: ref.scrollHeight,
			behavior: 'smooth'
		});
	}

	$: if (refColLeftText) {
		overflowsLeft = refColLeft?.scrollHeight > refColLeft?.clientHeight;
		console.log(refColLeftText.length, overflowsLeft);
	}
	$: if (refColRightText) {
		overflowsRight = refColRight?.scrollHeight > refColRight?.clientHeight;
		console.log(refColRightText.length, overflowsRight);
	}

	$: if (overflowsLeft) {
		autoscroll(refColLeft);
	}
	$: if (overflowsRight) {
		autoscroll(refColRight);
	}
</script>

<div
	id="prompt-screen"
	class="w-full h-full m-auto pt-[84px] pb-[103px] flex-col justify-between flex"
>
	<div class="grid w-full h-full">
		<div class="header relative line-clamp-2">
			<p>{challenge}</p>
			<div class="label absolute left-0 bottom-0">Challenge</div>
		</div>
		<div class="main relative">
			<div class="col-left pointer-events-none" bind:this={refColLeft}>
				<p contenteditable bind:innerText={refColLeftText}>
					{player0Prompt}
				</p>
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
			<div class="col-right pointer-events-none" bind:this={refColRight}>
				<p contenteditable bind:innerText={refColRightText}>
					{player1Prompt}
				</p>
			</div>
			<div class="footer">
				<div class="absolute left-0 bottom-0">{player0}</div>
				<div class="absolute right-0 bottom-0">{player1}</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	#prompt-screen .grid {
		grid-template-rows: 200px 646px;
		row-gap: 47px;
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
		padding: 20px;

		p {
			color: #fff;
			text-align: center;
			font-size: 60px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
		}

		.label {
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
	}

	.main {
		display: grid;
		grid-template-columns: 808px 240px 808px;
		grid-template-rows: 1fr;
		column-gap: 1rem;

		.col-left,
		.col-right {
			overflow: hidden;
			border: 2px solid #6eebea;
			background: #1c1f22;
			padding-bottom: 56px;
			overflow-y: auto;

			&::-webkit-scrollbar {
				width: 10px;
			}

			&::-webkit-scrollbar-track {
				background: transparent;
			}

			&::-webkit-scrollbar-thumb {
				background: #6eebea;
			}

			p {
				padding: 0.5rem;
				color: #6eebea;
				font-size: 36px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
			}
		}

		.col-left {
			div {
				border-top: 2px solid #6eebea;
				border-right: 2px solid #6eebea;
			}
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

		.col-right {
			div {
				border-top: 2px solid #6eebea;
				border-left: 2px solid #6eebea;
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
