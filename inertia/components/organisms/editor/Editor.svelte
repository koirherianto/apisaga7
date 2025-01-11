<script lang="ts">
	import { onMount } from 'svelte';

	import '~/css/editor.css';
	import Button from '~/components/atoms/button/Button.svelte';
	import HtmlView from '~/components/organisms/editor/HtmlView.svelte';
	import Preview from '~/components/organisms/editor/Preview.svelte';
	import Tab from '~/components/organisms/tab/Tab.svelte';
	import MarkdownEditor from '~/components/organisms/editor/MarkdownEditor.svelte';

	onMount(() => {

		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = '/css/editor.css'; // Path relatif dari direktori public
		document.head.appendChild(link);

		return () => {
		// Bersihkan saat komponen di-unmount
			document.head.removeChild(link);
		};
	});

	export let currentPage;

	// let value = currentPage.content;

	export let value = `
### Calculator App
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.


\`\`\`go
package main // Package declaration

func add(a, b) {
	return a + b; // Add two numbers
}
\`\`\`
### Installation

- Install golang compiler [Golang](https://golang.org/)
- Clone the repository \`git clone https://github.com/carta-dev/carta.git\`
- Run \`make\`

### Social Links

- [Github](https://github.com/umardev500)
- [Facebook](https://facebook.com/umardev500)
`;

const tabs = [
	{ name: 'Editor', active: true },
	{ name: 'HTML', active: false },
	{ name: 'Preview', active: false }
]

</script>

<div class="border md-editor-container rounded-2xl overflow-hidden mt-[5.5rem] flex flex-col h-[calc(100vh-5.5rem)]">
	<Tab tabs={tabs}>
		<svelte:fragment slot="tab" let:tabs let:toggle let:activeTab>
			<div class="flex items-center py-4 px-4 justify-between border-b flex-wrap gap-4">
				<div class="flex tab items-center">
					{#each tabs as tab, i}
						<button
							on:click={() => toggle(i)}
							class="{activeTab === i ? 'active' : ''} text-nowrap text-gray-500">{tab.name}</button
						>
					{/each}
				</div>
				<div class="flex items-center gap-2 w-full lg:w-auto">
					<Button variant="secondary">Cancel</Button>
					<Button>Save Changes</Button>
				</div>
			</div>
		</svelte:fragment>

		<svelte:fragment slot="content" let:activeTab>
			{#if activeTab === 0}
				<MarkdownEditor bind:md={value}/>
			{/if}

			{#if activeTab === 1}
				<HtmlView mdValue={value} />
			{/if}

			{#if activeTab === 2}
				<Preview mdValue={value} />
			{/if}
		</svelte:fragment>
	</Tab>
</div>


<style>
	.tab > button {
		@apply px-4 py-1 rounded-xl border border-white;
	}
	.tab .active {
		@apply font-medium;
		@apply border-gray-300;
		@apply bg-white;
		@apply text-gray-800;
	}

	/* ----------------------- style editor ------------------ */

	.md-editor-container:focus-within {
		outline: 1px solid #fee2e2; /* Equivalent of outline-red-100 */
	}

	html.dark .shiki,
	html.dark .shiki span {
		color: var(--shiki-dark) !important;
	}

</style>
