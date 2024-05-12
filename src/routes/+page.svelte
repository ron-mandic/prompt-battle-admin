<script lang="ts">
	import { TEXT_H1 } from '$lib/ts/constants';
	import { onMount } from 'svelte';
	import { Socket, io } from 'socket.io-client';

	let socket: Socket = io('http://localhost:3000');
	let player0 = '';
	let player1 = '';

	onMount(() => {
		return () => {
			socket.disconnect();
		};
	});
</script>

<div class="w-full h-full m-auto pt-[61px] pb-[42px] flex-col justify-between flex">
	<div class="top">
		<h1 class="uppercase text-center w-full">{@html TEXT_H1}</h1>
		<div class="players flex w-full px-[181px] items-center gap-[75px]">
			<div id="player-0" class="player py-[25px]">
				<span class="relative">{player0}</span>
			</div>
			<div class="vs">vs</div>
			<div id="player-1" class="player py-[25px]">
				<span class="relative">{player1}</span>
			</div>
		</div>
	</div>
	<div class="bottom flex flex-col items-center gap-[28px]">
		<a href="/admin?mode=P" class="link-button flex flex-col">
			<div class="flex-col flex items-center mt-[8px]">
				<span class="text">start</span>
				<span class="text-addition">(Prompt only)</span>
			</div>
		</a>
		<a href="/admin?mode=PS" class="link-button flex flex-col">
			<div class="flex-col flex items-center mt-[8px]">
				<span class="text">start</span>
				<span class="text-addition">(Prompt & Scribble)</span>
			</div>
		</a>
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

			&::after {
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
			}
		}
	}

	.link-button {
		width: 774px;
		height: 200px;
		border: 2px solid #6eebea;
		background: #1c1f22;
		padding: 1px 0 0.5rem;

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
