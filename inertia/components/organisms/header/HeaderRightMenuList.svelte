<script lang="ts">
	import AngleDownIcon from '~/components/atoms/icons/AngleDownIcon.svelte';
	import DeleteIcon from '~/components/atoms/icons/DeleteIcon.svelte';
	import GithubIcon from '~/components/atoms/icons/GithubIcon.svelte';
	import LangIcon from '~/components/atoms/icons/LangIcon.svelte';
	import PenIcon from '~/components/atoms/icons/PenIcon.svelte';
	import PlusIcon from '~/components/atoms/icons/PlusIcon.svelte';
	import SunIcon from '~/components/atoms/icons/SunIcon.svelte';
	import DropdownMenu from '~/components/molecules/dropdown/DropdownMenu.svelte';
	import AddNewVersionModal from '~/components/organisms/modals/AddNewVersionModal.svelte';
	import DeleteConfirm from '~/components/organisms/modals/DeleteConfirm.svelte';
	import SearchModal from '~/components/organisms/modals/SearchModal.svelte';

	import Sortable from 'sortablejs';
	import { onDestroy, onMount } from 'svelte';

	import type { Version } from '~/types/version'
	import type { Language } from '~/types/language'
	import { versionStore, currentVersionStore } from '~/stores/version'
	import { languagesStore } from '~/stores/language'

	let versions: Version[] = [];
	let currentVersion: Version;
	let languages: Language[] = [];

	const unsubscribeVersion = versionStore.subscribe((data) => {
		versions = data;
	});

	const unsubcribeCurrentVersion = currentVersionStore.subscribe((data) => {
		currentVersion = data;
	});

	const unsubscribeLanguages = languagesStore.subscribe((data) => {
		languages = data;
	});

	let versionSortableMenu: HTMLElement;

	let sortableInstance: Sortable;

	onMount(() => {
		sortableInstance = Sortable.create(versionSortableMenu, {
			animation: 150,
			filter: '.not-sortable'
		});
	});

	onDestroy(() => {
		sortableInstance?.destroy();
		unsubscribeVersion();
		unsubcribeCurrentVersion();
		unsubscribeLanguages();
	});

	const confirmDeleting = (e: CustomEvent<() => void>) => {
		console.log('do deleting');
		e.detail(); // toggle modal
	};

	const handleNewVersionSubmit = (event: CustomEvent<{ name: string; slug: string }>) => {
        const { name, slug } = event.detail;
        console.log('Name:', name, 'Slug:', slug);

        // kirim data ke api post ke endpoint /api/versions
		fetch('/u/version', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name, slug, is_default: false })
		}).then((res) => res.json()).then((data) => {
			// jika berhasil, tambahkan data ke store
			versionStore.update((versions) => [...versions, data]);
		}).catch((err) => {
			console.error(err);
		})
    };
</script>

<ul class="flex items-center gap-4">
	<li class="relative cursor-pointer">
		<SearchModal />
	</li>
	<li class="relative cursor-pointer">
		<button class="flex">
			<SunIcon />
		</button>
	</li>
	<li class="relative">
		<!-- Dropdown menu -->
		<DropdownMenu>
			<!-- Trigger button -->
			<svelte:fragment slot="trigger" let:toggleDropdown>
				<button on:click={toggleDropdown} class="text-black text-base font-medium flex items-center gap-1">
					<span>
						<LangIcon />
					</span>
					<span>{languages[0].title}</span>
					<AngleDownIcon classList="size-5" />
				</button>
			</svelte:fragment>

			<svelte:fragment slot="menu">
				{#each languages as language}
				<a class="text-base text-nowrap hover:bg-gray-50 rounded-md px-4 py-1" href="/#">
					{language.title}
				</a>
				{/each}
			</svelte:fragment>
		</DropdownMenu>
	</li>
	<li class="relative">
		<DropdownMenu>
			<!-- Trigger button -->
			<svelte:fragment slot="trigger" let:toggleDropdown>
				<button on:click={toggleDropdown} class="text-black text-base font-medium flex items-center gap-1 not-sortable">
					<span>{currentVersion.name}</span>
					<AngleDownIcon classList="!size-5" />
				</button>
			</svelte:fragment>

			<svelte:fragment slot="menu">
				<div class="px-4 text-base pb-1 not-sortable font-medium">Versions</div>
				<div bind:this={versionSortableMenu} class="mt-1">
					{#each versions as version}
						<div bind:this={versionSortableMenu} class="flex mb-2 items-center group hover:bg-gray-50 rounded-md px-4 py-1 cursor-pointer">
							<a class="text-base flex-1 flex items-center text-nowrap" href="/#">
								{version.name}
							</a>
							<!-- Right icon for editable menu -->
							<div class="hidden group-hover:flex items-center justify-center gap-1">
								<AddNewVersionModal title="Edit version">
									<svelte:fragment slot="trigger" let:toggle>
										<button class="" on:click={toggle}>
											<PenIcon classList="!size-5 fill-current" />
										</button>
									</svelte:fragment>
								</AddNewVersionModal>
								<DeleteConfirm
									text="Are you sure you want to delete this version?"
									subText="This action cannot be undone."
									on:confirm={confirmDeleting}
								>
									<svelte:fragment slot="trigger" let:toggle>
										<button class="" on:click={toggle}>
											<DeleteIcon classList="!size-5 fill-red-500" />
										</button>
									</svelte:fragment>
								</DeleteConfirm>
							</div>
						</div>
					{/each}
				</div>
				<!-- {#if $isEditor} -->
					<div class="flex justify-center not-sortable">
						<AddNewVersionModal title="Add a New Version." on:submit={handleNewVersionSubmit}>
							<svelte:fragment slot="trigger" let:toggle>
								<button on:click={toggle}>
									<PlusIcon classList="fill-green-500 size-5" />
								</button>
							</svelte:fragment>
						</AddNewVersionModal>
					</div>
				<!-- {/if} -->
			</svelte:fragment>
		</DropdownMenu>
	</li>
	<li>
		<a href="github.com/umardev500" class="flex">
			<GithubIcon />
		</a>
	</li>
</ul>
