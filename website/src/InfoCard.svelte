<script lang="ts">
    export let type: 'job' | 'education' | 'project';
    export let displayObject: any;

    let isHoveringCard = false;
    let isHoveringControls = false;

</script>


<div class={`relative bg-zinc-900 shadow-xl rounded-lg p-4 flex flex-col w-full`} on:mouseenter={() => isHoveringCard = true} on:mouseleave={() => isHoveringCard = false} role="region">
    <!-- Position the buttons -->
    <div class="absolute top-4 left-4 flex space-x-1" on:mouseenter={() => isHoveringControls = true} on:mouseleave={() => isHoveringControls = false} role="region">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <div class={`badge relative ${isHoveringCard ? "bg-[#FF6054]" : "bg-[#545554]"} badge-xs`}>
            {#if isHoveringControls}
                <svg class="absolute rotate-45" width="10" height="10" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-label="Red Button">
                    <rect x="4" y="9" width="12" height="2" fill="#000000" />
                    <rect x="9" y="4" width="2" height="12" fill="#000000" />
                </svg>
            {/if}
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <div class={`badge relative ${isHoveringCard ? "bg-[#FFBD44]" : "bg-[#545554]"} badge-xs`} >
            {#if isHoveringControls}
                <svg class="absolute" width="8" height="8" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-label="Yellow Button">
                    <rect x="4" y="9" width="12" height="2" fill="#000000" />
                </svg>
            {/if}
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <div class={`badge relative ${isHoveringCard ? "bg-[#00CA4E]" : "bg-[#545554]"} badge-xs`}>
            {#if isHoveringControls}
                <svg class="absolute rotate-45" width="8" height="8" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-label="Green Button">
                    <polygon points="7,5 2,10 7,15" fill="#000000" />
                    <polygon points="13,5 18,10 13,15" fill="#000000" />
                </svg>
            {/if}
        </div>
    </div>
    {#if type === "project"}
        <h4 class="text-xl font-bold">{displayObject.subheading}</h4>
        <p class="text-md text-gray-400">{displayObject.year}</p>
        <p class="text-gray-300 flex-grow">{displayObject.content}</p>
        {#if displayObject.tech}
            <p class="text-gray-400 mt-2">{displayObject.tech}</p>
        {/if}
        {#if displayObject.github || displayObject.website}
            <div class="flex justify-between gap-3 w-full">
            {#if displayObject.website}
                <a href={displayObject.website} target="_blank" class={`btn bg-[#191e24] hover:bg-[#15191e] hover:border-[#15191e] border-[#191e24] text-white hover:text-white mt-4 flex-grow`}>View Project</a>
            {/if}
            {#if displayObject.github}
                <a href={displayObject.github} target="_blank" class={`btn bg-[#191e24] hover:bg-[#15191e] hover:border-[#15191e] border-[#191e24] text-white hover:text-white mt-4 flex-grow`}>Source Code</a>
            {/if}
            </div>
        {/if}
    {:else if type === "education"}
        <div class="flex gap-3 justify-center place-items-center mt-1">
            <div class="avatar">
                <div class="w-5 h-5 rounded-full">
                <img src={`/images/${displayObject.image}`} alt="" />
                </div>
            </div>
            <h4 class="text-xl font-bold">{displayObject.name}</h4>
        </div>
        <p class="text-gray-200">{displayObject.location}</p>
        <p class="text-gray-400">{displayObject.timeline}</p>
        <p class="text-gray-300">{displayObject.degree}{displayObject.major ? ' - ' + displayObject.major : ''}</p>
    {:else if type == "job"}
        <div class="flex gap-3 justify-center place-items-center mt-1">
          <div class="avatar">
            <div class="w-5 h-5 rounded-full">
              <img src={`/images/${displayObject.image}`} alt="" />
            </div>
          </div>
          {#if displayObject.website}
            <a class="text-white hover:text-white hover:underline" href={displayObject.website}><h4 class="text-xl font-bold">{displayObject.subheading}</h4></a>
          {:else}
            <h4 class="text-xl font-bold">{displayObject.subheading}</h4>
          {/if}
        </div>
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
</div>