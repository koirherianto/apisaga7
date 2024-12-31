<script lang="ts">
  export let md = '# Hello world!'
</script>

<div class="w-full h-full max-w-4xl max-h-screen p-4">
  <textarea
    bind:value={md}
    class="w-full h-full resize-none border border-gray-300 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Tulis sesuatu..."
  ></textarea>
</div>
