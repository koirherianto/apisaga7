<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import ModalHeader from '~/components/molecules/modal/ModalHeader.svelte';
    import Button from '~/components/atoms/button/Button.svelte';
    import TextInput from '~/components/atoms/form/TextInput.svelte';
    import ModalHost from '../modal/ModalHost.svelte';

    export let title = 'Add a New Version';

    const dispatch = createEventDispatcher();

    let name = '';
    let slug = '';

    const handleSubmit = () => {
        dispatch('submit', { name, slug }); // Kirim data ke parent
    };
</script>

<ModalHost>
    <svelte:fragment slot="trigger" let:toggle>
        <slot name="trigger" {toggle} />
    </svelte:fragment>

    <svelte:fragment slot="inner" let:toggle>
        <div class="bg-white rounded-lg overflow-hidden lg:w-[447px] mx-auto">
            <ModalHeader on:toggle={toggle} {title} />
            <div class="py-6 px-6">
                <TextInput bind:value={name} classList="mb-4" label="Name" placeholder="Enter the page name" />
                <TextInput bind:value={slug} classList="" label="Slug" placeholder="Enter the page slug" />
                <Button on:click={() => { handleSubmit(); toggle(); }} classList="mt-4" size="large">Save Changes</Button>
            </div>
        </div>
    </svelte:fragment>
</ModalHost>
