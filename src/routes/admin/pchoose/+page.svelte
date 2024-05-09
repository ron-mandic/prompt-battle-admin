<script lang="ts">
	import ImageThumbnail from '$lib/components/ImageThumbnail.svelte';
	import IconCross from '$lib/components/IconCross.svelte';
	import IconCheck from '$lib/components/IconCheck.svelte';
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let player0Score = 2;
	let player1Score = 1;

	let boolA = false;
	let boolB = false;
</script>

<div class="relative w-full debug h-full m-auto pt-[61px] pb-[42px] flex-col justify-between flex">
	<div class="top flex flex-col justify-start">
		<div class="players flex w-full px-[181px] items-center gap-[75px]">
			<div id="player-0">
				<div class="player py-[25px] relative">
					<span class="relative">Andreas</span>
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
					<ImageThumbnail chosen />
					<ImageThumbnail chosen />
					<ImageThumbnail chosen />
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
					<span class="relative">Andreas</span>
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
					<ImageThumbnail chosen />
					<ImageThumbnail chosen />
					<ImageThumbnail chosen />
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