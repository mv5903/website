<script lang="ts">
    import isMobile from "is-mobile";
    import { onMount, tick } from "svelte";
    import InfoCardImageCarousel from "./InfoCardImageCarousel.svelte";

    export let type: 'job' | 'education' | 'project';
    export let displayObject: any;
    export let minimized: boolean;
    export let fullScreen: boolean;
    
    export let onFullscreenPressed: () => void;
    export let onMinimizePressed: () => void;
    export let onClosePressed: () => void;

    let isHoveringCard = false;
    let isHoveringControls = false;

    let mobileView: boolean | null = null;
    onMount(() => {
        mobileView = isMobile();
    })

    async function onImagePressed(preview: string) {
        onFullscreenPressed();
        await tick(); // Wait for the DOM to update
        document.getElementById(`carousel-${preview}`)?.scrollIntoView({ behavior: "instant" });
    }
</script>

<div class={`relative ${!minimized && "h-full"} ${(mobileView != null && mobileView == true) ? "w-[94%] mx-auto" : "w-full"} bg-zinc-900 shadow-md rounded-lg px-4 pt-8 pb-4 flex flex-col place-items-center justify-between`} on:mouseenter={() => isHoveringCard = true} on:mouseleave={() => isHoveringCard = false} role="region">
    <!-- Position the buttons -->
    {#if !mobileView}
        <div class="absolute top-4 left-4 flex space-x-1" on:mouseenter={() => isHoveringControls = true} on:mouseleave={() => isHoveringControls = false} role="region">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                {#if !fullScreen}
                    <div on:click={() => onClosePressed() } class={`badge relative ${isHoveringCard || isMobile() ? "bg-[#FF6054]" : "bg-[#545554]"} badge-xs`}>
                        {#if isHoveringControls}
                        <svg class="absolute rotate-45" width="10" height="10" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-label="Red Button">
                            <rect x="4" y="9" width="12" height="2" fill="#000000" />
                            <rect x="9" y="4" width="2" height="12" fill="#000000" />
                        </svg>
                        {/if}
                    </div>
                {:else}
                    <div class={`badge relative bg-[#545554] badge-xs`}></div>
                {/if}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                {#if !fullScreen}
                    <div on:click={() => onMinimizePressed() } class={`badge relative ${isHoveringCard || isMobile() ? "bg-[#FFBD44]" : "bg-[#545554]"} badge-xs`} >
                        {#if isHoveringControls}
                        <svg class="absolute" width="8" height="8" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-label="Yellow Button">
                            <rect x="4" y="9" width="12" height="2" fill="#000000" />
                        </svg>
                        {/if}
                    </div>
                {:else}
                    <div class={`badge relative bg-[#545554] badge-xs`} ></div>
                {/if}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div on:click={() => onFullscreenPressed() } class={`badge relative ${isHoveringCard || isMobile() ? "bg-[#00CA4E]" : "bg-[#545554]"} badge-xs`}>
                {#if isHoveringControls}
                    {#if !fullScreen}
                        <svg class="absolute rotate-45" width="8" height="8" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-label="Green Button">
                            <polygon points="7,5 2,10 7,15" fill="#000000" />
                            <polygon points="13,5 18,10 13,15" fill="#000000" />
                        </svg>
                    {:else}
                        <svg class="absolute rotate-45" width="8" height="8" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-label="Green Button">
                            <polygon points="4,5 8,10 4,15" fill="#000000" />
                            <polygon points="16,5 12,10 16,15" fill="#000000" />
                        </svg>
                    {/if}
                {/if}
            </div>
        </div>
    {/if}
    {#if type === "project"}
    <div>
        <h4 class="text-xl font-bold">{displayObject.subheading}</h4>
        {#if !minimized}
            <p class="text-md text-gray-400">{displayObject.year}</p>
            <p class="text-gray-300">{displayObject.content}</p>
        {/if}
        {#if displayObject.tech}
            <p class="text-gray-400 mt-2">{displayObject.tech}</p>
        {/if}
    </div>
    <div class="w-full">
        {#if !minimized}
            {#if displayObject.previews}
                <InfoCardImageCarousel fullScreen={fullScreen} displayObject={displayObject} onImagePressed={onImagePressed} />
            {/if}
            {#if displayObject.github || displayObject.website}
                <div class="flex justify-between gap-3 w-full">
                    {#if displayObject.website}
                        <a href={displayObject.website} target="_blank" class={`btn bg-[#191e24] hover:bg-[#15191e] hover:border-[#15191e] border-[#191e24] text-white hover:text-white mt-4 flex-grow shadow-lg`}>View Project</a>
                    {/if}
                    {#if displayObject.github}
                        <a href={displayObject.github} target="_blank" class={`btn bg-[#191e24] hover:bg-[#15191e] hover:border-[#15191e] border-[#191e24] text-white hover:text-white mt-4 flex-grow shadow-lg`}>Source Code</a>
                    {/if}
                </div>
            {/if}
        {/if}
    </div>
    {:else if type === "education"}
        <div class="flex gap-3 justify-center place-items-center mt-1">
            <div class="avatar">
                <div class="w-5 h-5 rounded-full">
                    <img src={`/images/card-logos/${displayObject.image}`} alt="" />
                </div>
            </div>
            <h4 class="text-xl font-bold">{displayObject.name}</h4>
        </div>
        {#if !minimized}
            <p class="text-gray-200">{displayObject.location}</p>
            <p class="text-gray-400">{displayObject.timeline}</p>
            <p class="text-gray-300">{displayObject.degree}{displayObject.major ? ' - ' + displayObject.major : ''}</p>
        {/if}
    {:else if type == "job"}
        <div class="flex gap-3 justify-center place-items-center mt-1">
            <div class="avatar">
                <div class="w-5 h-5 rounded-full">
                    <img src={`/images/card-logos/${displayObject.image}`} alt="" />
                </div>
            </div>
            {#if displayObject.website}
                <a class="text-white hover:text-white hover:underline" href={displayObject.website}><h4 class="text-xl font-bold">{displayObject.subheading}</h4></a>
            {:else}
                <h4 class="text-xl font-bold">{displayObject.subheading}</h4>
            {/if}
        </div>
        {#if !minimized}
            <div class="flex justify-center">
                <p class="text-gray-200">{displayObject.location.substring(0, displayObject.location.indexOf("-"))} <span class="italic">{displayObject.location.substring(displayObject.location.indexOf("-"))}</span></p>
            </div>
            <p class="text-gray-400">{displayObject.date}</p>
            {#each displayObject.content.split("\n") as bullet}
                <p class="text-gray-300">{bullet}</p>
            {/each}
            {#if displayObject.tech}
                <p class="text-gray-400 mt-2">{displayObject.tech}</p>
            {/if}
        {/if}
    {/if}
</div>

<style>
    :global(.badge) {
        border-color: transparent;
    }
</style>