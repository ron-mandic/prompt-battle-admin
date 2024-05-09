<script lang="ts">
	import { onMount } from 'svelte';

	let loop: NodeJS.Timeout;
	let ref: HTMLDivElement;
	let refText: string;
	let overflows = false;

	export let duration = 3500;
	export let innerText: string;

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

<div class="autoscroll relative">
	<div
		class="as-container w-full h-[311px] relative overflow-y-auto pointer-events-none"
		bind:this={ref}
	>
		<p contenteditable bind:innerText={refText}>{innerText}</p>
	</div>
	<div class="label absolute left-0 bottom-0">Challenge</div>
</div>

<style lang="scss">
	.autoscroll {
		border: 2px solid #6eebea;
	}

	.as-container {
		background: #1c1f22;
		width: 1888px;
		padding: 20px 17px;

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
			color: #fff;
			text-align: center;
			font-size: 80px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
		}
	}
</style>
