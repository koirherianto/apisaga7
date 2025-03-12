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
	import type { Topbar } from '~/types/topbar'
	import type { Post } from '~/types/post' 
	import { versionStore, currentVersionStore } from '~/stores/version'
	import { currentTobarStore } from '~/stores/topbar'
	import { currentProjectStore } from '~/stores/project'
	import { currentPageStore } from '~/stores/post_data';
	import { languagesStore } from '~/stores/language'
  import type { Menu } from '~/types/menu'

	let versions: Version[] = [];
	let currentVersion: Version;
	let currentProject: Project;
	let currentTopbar: Topbar
	let currentPage: Post | Menu;
	let languages: Language[] = [];

	const unsubscribeCurrentPageStore = currentPageStore.subscribe((data) => {
		currentPage = data;
	});

	const unsubcribeCurrentTopbar = currentTobarStore.subscribe((data) => {
		currentTopbar = data;
	});

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

	$: versions = $versionStore;

	onMount(() => {
		sortableInstance = Sortable.create(versionSortableMenu, {
			animation: 150,
			filter: '.not-sortable',
			onEnd: (event) => {
				const oldIndex = versions.findIndex(v => String(v.id) === event.item.dataset.id);
				const newIndex = event.newIndex;

				if (oldIndex === newIndex || oldIndex === -1) {
					console.warn("Invalid index detected!");
					return;
				}

				const item = versions[oldIndex];
				const newVersions = [...versions];

				newVersions.splice(oldIndex, 1);
				newVersions.splice(newIndex!, 0, item);
				fetch(`/u/version/reorder`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ 
						versions: newVersions.map(v => v.id),
						project_id: currentProject.id
					})
				}).then(res => res.json())
				.then(data => {
					if (data.data) {
						versionStore.set(newVersions);
						alert('Successfully reordered version');
					} else {
						alert(data.errors);
					}
				}).catch(err => {
					alert('Failed to reorder version: ' + err.message);
				});
			}
		});
	});


	onDestroy(() => {
		sortableInstance?.destroy();
		unsubscribeVersion();
		unsubcribeCurrentVersion();
		unsubscribeLanguages();
		unsubscribeCurrentProject();
		unsubcribeCurrentTopbar();
		unsubscribeCurrentPageStore();
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
		.then((res) => res.json()).then((data) => {
			if (data.data) {
				versionStore.update((versions) => versions.filter((version) => version.id !== data.data.id));
				alert(data.message);
				onSuccess(); 
			} else if (data.errors) {
				alert(data.errors);
			}else{
				alert('Failed to delete version');
			}
		}).catch((err) => {
			alert('Failed to delete version ' + err.message);
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
			body: JSON.stringify({ name, slug, is_default: false, current_version_id: currentVersion.id, project_id: currentProject.id, })
		})
		.then((res) => res.json()).then((data) => {
			if (data.data) {
				versionStore.update((versions) => [...versions, data.data]);
				alert(data.message);
			}else if(data.errors){
				alert(data.errors);
			}else {
				alert('Failed to add new version');
			}
		}).catch((err) => {
			alert('Failed to add new version ' + err.message);	
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
		.then((res) => res.json()).then((data) => {
			if (data.data) {
				versionStore.update((versions) => versions.map((version) => {
					if (version.id === data.data.id) {
						return data.data;
					}
					return version;
				}));
				alert(data.message);
			}else if(data.errors){
				alert(data.errors);
			}else{
				alert('Failed to update version');
			}
		}).catch((err) => {
			alert('Failed to update version ' + err.message);
		});
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
					{#each versions as version (version.id)}
						<div bind:this={versionSortableMenu} data-id={version.id} class="flex mb-2 items-center group hover:bg-gray-50 rounded-md px-4 py-1 cursor-pointer">
							<a class="text-base flex-1 flex items-center text-nowrap" href="/u/{currentProject.slug}/{version.slug}/{currentTopbar.slug}/{currentPage.slug}">
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
