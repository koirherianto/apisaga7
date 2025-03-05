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
	import type { Project } from '~/types/projects'
	import { versionStore, currentVersionStore } from '~/stores/version'
	import { currentProjectStore } from '~/stores/project'
	import { languagesStore } from '~/stores/language'

	let versions: Version[] = [];
	let currentVersion: Version;
	let currentProject: Project;
	let languages: Language[] = [];

	const unsubscribeVersion = versionStore.subscribe((data) => {
		versions = data;
	});

	const unsubcribeCurrentVersion = currentVersionStore.subscribe((data) => {
		currentVersion = data;
	});

	const unsubscribeCurrentProject = currentProjectStore.subscribe((data) => {
		currentProject = data;
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
		unsubscribeCurrentProject();
	});

	const confirmDeleting = (e: CustomEvent<{ id: number, onSuccess: () => void }>) => {
		const { id, onSuccess } = e.detail;

		fetch(`/u/version/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ project_id : currentProject.id })
		})
		.then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to delete version: ${res.statusText}`);
			}
			return res.json();
		})
		.then((data) => {
			versionStore.update((versions) => versions.filter((version) => version.id !== data.data.id));
			alert('Successfully deleted version');
			onSuccess(); 
		})
		.catch((err) => {
			alert('Failed to delete version' + err.message);
		});
	};


	const handleNewVersionSubmit = (event: CustomEvent<{ name: string; slug: string }>) => {
        const { name, slug } = event.detail;

        // kirim data ke api post ke endpoint /api/versions
		fetch('/u/version', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name, slug, is_default: false, project_id: currentProject.id })
		})
		.then((res) => {
			return res.json();  // Lanjutkan ke JSON parsing jika perlu
		})
		.then((data) => {
			if (data.data) {
				versionStore.update((versions) => [...versions, data.data]);
				alert('Successfully added new version');
			}else{
				alert(data.errors);
			}
		})
		.catch((err) => {
			alert('Gagal menambahkan versi baru' + err);
		})
    };

	const handleUpdateVersionSubmit = (event: CustomEvent<{ name: string; slug: string, id: string }>) => {
		const { name, slug, id } = event.detail;
		console.log(name, slug, id);
		fetch(`/u/version/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name, slug, project_id: currentProject.id })
		})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			if (data.data) {
				versionStore.update((versions) => versions.map((version) => {
					if (version.id === data.data.id) {
						return data.data;
					}
					return version;
				}));
				alert('Successfully updated version');
			}else{
				alert(data.errors);
			}
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
							<a class="text-base flex-1 flex items-center text-nowrap" href="/u/{currentProject.slug}/{version.slug}">
								{version.name}
							</a>
							<!-- Right icon for editable menu -->
							<div class="hidden group-hover:flex items-center justify-center gap-1">
								<AddNewVersionModal title="Edit version" name={version.name} slug={version.slug} id={version.id} on:submit={handleUpdateVersionSubmit}>
									<svelte:fragment slot="trigger" let:toggle>
										<button class="" on:click={toggle}>
											<PenIcon classList="!size-5 fill-current" />
										</button>
									</svelte:fragment>
								</AddNewVersionModal>
								<DeleteConfirm
									text="Are you sure you want to delete this version?"
									subText="This action cannot be undone."
									id={version.id}
									on:confirm={(e) => confirmDeleting(e)}
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
