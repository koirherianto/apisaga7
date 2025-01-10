<svelte:head>
  <title>Apisaga Editor</title>
</svelte:head>

<script lang="ts">
  export let md = '# Hello world!'

  import { onMount } from "svelte";
  import EasyMDE from "easymde";
  import "easymde/dist/easymde.min.css";
  let easymde: EasyMDE;

  onMount(() => {
    const textarea = document.getElementById("my-text-area");
    console.log(textarea)
    easymde = new EasyMDE({
      autofocus: true,
      initialValue: md,
      toolbar: [
        "undo", "redo", "|", "heading", "heading-2", "heading-3", "|",
        //@ts-ignore
        {
          name: "xtable",
          className: "fa fa-table p-0",
          action: function drawTable(editor) {
            var cm = editor.codemirror;
            var table = "| Header 1 | Header 2 | Header 3 |\n";
            table += "| -------- | -------- | -------- |\n";
            table += "| Column 1 | Column 2 | Column 3 |\n";
            cm.replaceSelection(table);
          },
        },
        //@ts-ignore
        {
          name: "xcode",
          className: "fa fa-code p-0",
          action: function drawCode(editor) {
            var cm = editor.codemirror;
            var code = "~~~\n// code here\n~~~";
            cm.replaceSelection(code);
          },
        },
        "bold", "italic", "strikethrough", "|",
        "quote", "clean-block", "unordered-list", "ordered-list", "|",
        "link", "image", "|",
        "preview", "side-by-side", "fullscreen", "|",
        "guide",
      ],
    });

    easymde.codemirror.on("change", () => {
      md = easymde.value(); // Get the current content
    });

  });
</script>

<div class="w-full h-full overflow-auto  max-w-4xl max-h-screen p-4">
  <textarea 
    bind:value={md}
    id="my-text-area"
    placeholder="Markdown here..."
    class="h-full resize-none border border-gray-300 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
</div>