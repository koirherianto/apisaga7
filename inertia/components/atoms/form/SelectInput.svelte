<script lang="ts">
	import AngleDownIcon from '~/components/atoms/icons/AngleDownIcon.svelte';
	import { onMount } from 'svelte';

	let selectEl: HTMLSelectElement;

	export let placeholder = '';
	export let classList = '';
	export let useCancelOption = true
	export let value = '';

	type Options = {
		label: string;
		value: string;
	};

	export let options: Options[] = [];
	let h = 'h-14';

	onMount(() => {
		selectEl.addEventListener('change', function () {
			if (this.value === '') {
				// Reset to the default placeholder
				this.selectedIndex = 0;
			}
		});
	});
</script>

<div class="relative flex {classList}">
	<!-- label A11y -->
	<select
		bind:this={selectEl}
		bind:value={value}
		class="w-full appearance-none border border-gray-300 bg-white rounded-lg outline-none {h} px-4 py-2 text-base focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
	>
		{#if placeholder && !value}
			<option value="" disabled selected hidden>{placeholder}</option>
		{/if}
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
		{#if useCancelOption}
			<option value="">Cancel / Reset</option>
		{/if}
	</select>


	<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
		<AngleDownIcon classList="fill-gray-600" />
	</div>
</div>
