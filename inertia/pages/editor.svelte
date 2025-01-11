<script lang="ts">
  import EditorLayout from "~/layouts/EditorLayout.svelte"
  import type { Project } from '~/types/projects'
  import type { Version } from "~/types/version"
  import type { Topbar } from "~/types/topbar"
  import type { Post, ReadPost } from '~/types/post';

  export let currentProject: Project
  export let currentVersion: Version
  export let currentTopbar: Topbar
  export let currentPage: Post

  export let versions: Version[]
  export let topbars: Topbar[]
  export let pages: Post[]

  // +page.server.ts
  const data: ReadPost = {
		category: 'categorry',
		parent: 'Getting Started',
		title: 'Installation',
		slug: 'installation',
		content: 'Hello World'
	};

  // +page.svelte editor
  import Editor from '~/components/organisms/editor/Editor.svelte';
  
</script>

<EditorLayout {topbars} {versions} {pages} {currentProject} {currentVersion} {currentTopbar} {currentPage}>
  <div class="px-4">
    <!-- Editor -->
    <div class="bg-white mt-6">
      <Editor {currentPage} />
    </div>
    <!-- End of Editor -->
  </div>
</EditorLayout>