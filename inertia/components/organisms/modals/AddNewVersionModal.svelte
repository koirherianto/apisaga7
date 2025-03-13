<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import ModalHeader from '~/components/molecules/modal/ModalHeader.svelte';
    import Button from '~/components/atoms/button/Button.svelte';
    import TextInput from '~/components/atoms/form/TextInput.svelte';
    import ModalHost from '../modal/ModalHost.svelte';
    import SelectInput from '~/components/atoms/form/SelectInput.svelte'

    export let title = '';
    export let name = '';
    export let slug = '';
    export let id = ''; //Id Version // untuk edit version
    
    let selectedVersionId = ''; // Untuk Menyimpan ID Version yang dipilih untuk duplicate
    export let versions: {label: string, value: string}[] = [];
    
    // jika versions ada isinya, maka ini adalah create
    let isCreate = versions.length !== 0;
    
    const dispatch = createEventDispatcher();
    const handleSubmit = () => {
        dispatch('submit', { name, slug, id, selectedVersionId });
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
                {#if isCreate}
					<SelectInput 
                        options={versions} 
                        bind:value={selectedVersionId} 
                        useCancelOption={false} 
                        classList="mb-4" 
                        placeholder="Copy from version" 
                    />
				{/if}
                <TextInput bind:value={name} classList="mb-4" label="Name" placeholder="Enter the page name" />
                <TextInput bind:value={slug} classList="" label="Slug" placeholder="Enter the page slug" />
                <Button on:click={() => { handleSubmit(); toggle(); }} classList="mt-4" size="large">Save Changes</Button>
            </div>
        </div>
    </svelte:fragment>
</ModalHost>
