<script lang="ts">
	import { onMount } from 'svelte';

	let loop: NodeJS.Timeout;
	let ref: HTMLDivElement;
	let refText: string;
	let overflows = false;

	export let disableScrollbar = false;
	export let route = 'prompt';
	export let duration = 3500;
	export let innerText: string;

	let attributes = disableScrollbar
		? {
				'data-disable-scrollbar': disableScrollbar
			}
		: {};

	onMount(() => {
		return () => clearInterval(loop);
	});

	function autoscroll(ref: HTMLElement) {
		loop = setInterval(function () {
			scrollToBottom(ref);

			setTimeout(function () {
				scrollToTop(ref);
			}, duration);
		}, duration * 2);
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

	$: if (refText) {
		overflows = ref?.scrollHeight > ref?.clientHeight;
		console.log(refText.length, overflows);
	}

	$: if (overflows) {
		autoscroll(ref);
	}
</script>

<div class="w-full h-full pointer-events-none" bind:this={ref} {...attributes}>
	<p contenteditable bind:innerText={refText} data-route={route}>
		{innerText}
	</p>
</div>

<style lang="scss">
	div {
		overflow: hidden;
		overflow-y: auto;
		padding-bottom: var(--padding-bottom, 0);

		&::-webkit-scrollbar {
			width: 10px;
		}
		&::-webkit-scrollbar-track {
			background: transparent;
		}
		&::-webkit-scrollbar-thumb {
			background: #6eebea;
		}

		&[data-disable-scrollbar] {
			scrollbar-width: none;
			-ms-overflow-style: none;

			&::-webkit-scrollbar {
				width: 0;
			}
			&::-webkit-scrollbar-track {
				background: none;
			}
			&::-webkit-scrollbar-thumb {
				background: none;
			}
		}

		p[data-route='prompt'] {
			padding: 0.5rem;
			color: #6eebea;
			font-size: 36px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
		}

		p[data-route='results'] {
			padding: 0.5rem;
			color: #fff;
			font-size: 24px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
		}
	}
</style>
