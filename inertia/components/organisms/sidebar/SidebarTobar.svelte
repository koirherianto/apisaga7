<script lang="ts">
    import ArrowLeft from '~/components/atoms/icons/ArrowLeft.svelte';
	import GithubIcon from '~/components/atoms/icons/GithubIcon.svelte';
    import SunIcon from '~/components/atoms/icons/SunIcon.svelte';
    import ListIcon from '~/components/atoms/icons/ListIcon.svelte';
</script>

<div class="flex items-center border-b h-16 px-4 heading relative">
    <!-- Top Desktop -->
    <div class="lg:flex items-center gap-2 text-nowrap text w-full sidebar-top-desktop hidden">
        <span class="text-gray-900">
            <ArrowLeft classList="fill-current" />
        </span>
        <span class="font-bold text-black">APISAGAD</span>
    </div>

    <button  class="hover:text-gray-800 absolute right-4 toggler hidden lg:inline-flex">
        <ListIcon classList="!size-5 fill-current" />
    </button>
    <!-- End of Top Desktop -->

    <div class="h-full px-2 flex items-center justify-between mobile-menu lg:hidden w-full">
        <div class="flex items-center gap-2">
            <button>
                <ArrowLeft />
            </button>

            <span class="font-bold text-base">APISAGA leftbar</span>
        </div>

        <div class="flex items-center gap-2">
            <button>
                <SunIcon />
            </button>
            <a href="https://github.com/umardev500">
                <GithubIcon />
            </a>
            <button >
                <ListIcon />
            </button>
        </div>
    </div>
</div>