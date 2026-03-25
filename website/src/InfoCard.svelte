<script lang="ts">
    import isMobile from "is-mobile";
    import { onMount, tick } from "svelte";
    import InfoCardImageCarousel from "./InfoCardImageCarousel.svelte";

    export let type: 'job' | 'education' | 'project';
    export let displayObject: any;
    export let fullScreen: boolean;

    export let onFullscreenPressed: () => void;

    let mobileView: boolean | null = null;
    onMount(() => {
        mobileView = isMobile();
    })

    const techColors: Record<string, string> = {
        // JS ecosystem
        'JavaScript': 'bg-yellow-700/40 text-yellow-100',
        'Javascript': 'bg-yellow-700/40 text-yellow-100',
        'TypeScript': 'bg-blue-700/40 text-blue-100',
        'Typescript': 'bg-blue-700/40 text-blue-100',
        'Node.js': 'bg-green-700/40 text-green-100',
        'React': 'bg-cyan-700/40 text-cyan-100',
        'Next.js': 'bg-violet-600/40 text-violet-100',
        'jQuery': 'bg-blue-600/40 text-blue-100',
        'Alpine.js': 'bg-teal-600/40 text-teal-100',
        // Styling
        'Tailwind': 'bg-sky-700/40 text-sky-100',
        'Bootstrap': 'bg-purple-700/40 text-purple-100',
        'HTML': 'bg-orange-600/40 text-orange-100',
        'CSS': 'bg-blue-500/40 text-blue-100',
        // Languages
        'Python': 'bg-yellow-600/40 text-yellow-100',
        'Java': 'bg-red-700/40 text-red-100',
        'C#': 'bg-violet-700/40 text-violet-100',
        'SwiftUI': 'bg-orange-600/40 text-orange-100',
        'PHP': 'bg-indigo-700/40 text-indigo-100',
        // .NET
        'Asp.NET': 'bg-purple-600/40 text-purple-100',
        // Data
        'PostgreSQL': 'bg-blue-700/40 text-blue-100',
        'MySQL': 'bg-amber-700/40 text-amber-100',
        'SQL': 'bg-amber-600/40 text-amber-100',
        'SQL Server': 'bg-red-600/40 text-red-100',
        'MongoDB': 'bg-green-700/40 text-green-100',
        'Prisma': 'bg-teal-700/40 text-teal-100',
        'Flask': 'bg-rose-700/40 text-rose-100',
        // Build / tools
        'Gradle': 'bg-teal-600/40 text-teal-100',
        'Git': 'bg-orange-700/40 text-orange-100',
        'Jenkins': 'bg-red-600/40 text-red-100',
        'IntelliJ': 'bg-pink-600/40 text-pink-100',
        'Selenium': 'bg-green-600/40 text-green-100',
        'JUnit': 'bg-emerald-600/40 text-emerald-100',
        // Platforms / services
        'Vercel': 'bg-fuchsia-700/40 text-fuchsia-100',
        'Auth0': 'bg-orange-700/40 text-orange-100',
        'iOS': 'bg-blue-600/40 text-blue-100',
        'Raspberry Pi': 'bg-pink-700/40 text-pink-100',
        'Home Assistant': 'bg-sky-600/40 text-sky-100',
        // APIs
        'OpenAI API': 'bg-emerald-700/40 text-emerald-100',
        'Spotify API': 'bg-green-600/40 text-green-100',
        'Mapbox': 'bg-indigo-600/40 text-indigo-100',
        'Minecraft Forge': 'bg-lime-700/40 text-lime-100',
        // Education
        'Scratch': 'bg-amber-600/40 text-amber-100',
        'APCSA': 'bg-cyan-600/40 text-cyan-100',
    };

    function getTechColor(tech: string): string {
        return techColors[tech] || 'bg-purple-700/40 text-purple-100';
    }

    async function onImagePressed(preview: string) {
        onFullscreenPressed();
        await tick(); // Wait for the DOM to update
        document.getElementById(`carousel-${preview}`)?.scrollIntoView({ behavior: "instant" });
    }
</script>

<div class={`relative h-full ${(mobileView != null && mobileView == true) ? "w-[94%] mx-auto" : "w-full"} bg-zinc-900 shadow-md rounded-lg px-4 pt-4 pb-4 flex flex-col place-items-center justify-between`} role="region">
    {#if type === "project"}
    <div>
        <div class="flex items-center justify-center gap-2">
            <h4 class="text-xl font-bold">{displayObject.subheading}</h4>
            {#if displayObject.website}
                <a href={displayObject.website} target="_blank" class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white transition-colors tooltip" data-tip="View Project" on:click|stopPropagation>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            {/if}
            {#if displayObject.github}
                <a href={displayObject.github} target="_blank" class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white transition-colors tooltip" data-tip="Source Code" on:click|stopPropagation>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                </a>
            {/if}
        </div>
        <p class="text-md text-gray-400">{displayObject.year}</p>
        <p class="text-gray-300">{displayObject.content}</p>
        {#if displayObject.tech}
            <div class="flex flex-wrap gap-1.5 mt-2">
                {#each displayObject.tech.split(",").map(t => t.trim()) as tech}
                    <span class="badge badge-sm border-0 {getTechColor(tech)}">{tech}</span>
                {/each}
            </div>
        {/if}
    </div>
    <div class="w-full">
        {#if displayObject.previews}
            <InfoCardImageCarousel fullScreen={fullScreen} displayObject={displayObject} onImagePressed={onImagePressed} />
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
        <p class="text-gray-200">{displayObject.location}</p>
        <p class="text-gray-400">{displayObject.timeline}</p>
        <p class="text-gray-300">{displayObject.degree}{displayObject.major ? ' - ' + displayObject.major : ''}</p>
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
        <div class="flex justify-center">
            <p class="text-gray-200">{displayObject.location.substring(0, displayObject.location.indexOf("-"))} <span class="italic">{displayObject.location.substring(displayObject.location.indexOf("-"))}</span></p>
        </div>
        <p class="text-gray-400">{displayObject.date}</p>
        {#each displayObject.content.split("\n") as bullet}
            <p class="text-gray-300">{bullet}</p>
        {/each}
        {#if displayObject.tech}
            <div class="flex flex-wrap gap-1.5 mt-2 justify-center">
                {#each displayObject.tech.split(",").map(t => t.trim()) as tech}
                    <span class="badge badge-sm border-0 {getTechColor(tech)}">{tech}</span>
                {/each}
            </div>
        {/if}
    {/if}
</div>

<style>
    :global(.badge) {
        border-color: transparent;
    }
</style>