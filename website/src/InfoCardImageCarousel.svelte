<script lang="ts">
    export let fullScreen: boolean;
    export let displayObject: { previews: string[], [key: string]: any };
    export let onImagePressed: (preview: string) => void;

    let isTransitioning = false;
    let transitionTimeout: number | undefined;

    function onSlideChange() {
        isTransitioning = true;
        if (transitionTimeout) {
            clearTimeout(transitionTimeout); 
        }
        transitionTimeout = setTimeout(() => {
            isTransitioning = false;
        }, 500); // Adjust timeout to match your slide transition duration
    }
</script>

<div class="mt-2 max-h-[40vh]">
    {#if fullScreen}
        <div class="carousel">
            {#each displayObject.previews as preview}
                {@const prev = displayObject.previews[(displayObject.previews.indexOf(preview) - 1 + displayObject.previews.length) % displayObject.previews.length]}
                {@const next = displayObject.previews[(displayObject.previews.indexOf(preview) + 1) % displayObject.previews.length]}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div id={`carousel-${preview}`} class="carousel-item relative w-full flex justify-center">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <img src={"/images/previews/" + preview} alt="" class="max-w-full rounded-lg max-h-[40vh]" />
                    <div class={`absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                        {#if displayObject.previews.length > 1}
                            <a href={`#carousel-${prev}`} class="btn btn-circle opacity-10 hover:opacity-100 shadow-md" on:click={() => onSlideChange()}>❮</a>
                            <a href={`#carousel-${next}`} class="btn btn-circle opacity-10 hover:opacity-100 shadow-md" on:click={() => onSlideChange()}>❯</a>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <div class="flex gap-3 mt-2 justify-center overflow-hidden">
            {#each displayObject.previews as preview}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <img src={"/images/previews/" + preview} alt="" class="h-24 max-w-full rounded-lg cursor-pointer shadow-md" on:click={() => onImagePressed(preview) } />
            {/each}
        </div>
    {/if}
</div>