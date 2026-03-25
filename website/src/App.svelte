<script lang="ts">
    import { footer } from "./assets/footer";
    import { projects } from "./assets/projects";
    import { schools } from "./assets/schools";
    import { sections } from "./assets/sections";
    import { workExperience } from "./assets/workExperience";
    import { getTechColor } from "./assets/techColors";

    import { isMobile } from "is-mobile";

    import { onMount } from "svelte";
    import Blog from "./Blog.svelte";
    import InfoCard from "./InfoCard.svelte";
    import ThreeDBackground from "./ThreeDBackground.svelte";

    let showDownArrow = false;

    let currentYear = new Date().getFullYear();

    onMount(() => {
        setTimeout(() => {
            showDownArrow = true;
        }, 1000);

        return () => {
            // Clean up event listeners when component is destroyed
            document.removeEventListener("keydown", handleKeyDown);
        };
    });

    const scrollDownToSection = async (id: string) => {
        let sideBar = document.getElementById("my-drawer") as HTMLInputElement;
        if (sideBar) sideBar.checked = !sideBar.checked;
        window.location.href = window.location.origin + "#" + id;
    };

    let fullScreenInfoCard: string = "";

    function resetFullScreen() {
        fullScreenInfoCard = "";
        document.body.classList.remove("overflow-hidden");
    }

    function onFullscreenPressed(displayObject: any) {
        if (isMobile()) return;
        const id = displayObject.id;

        // Toggle fullscreen mode
        fullScreenInfoCard = fullScreenInfoCard === id ? "" : id;
        document.body.classList.toggle("overflow-hidden");

        // If the card is fullscreen, add listener to close on escape key
        if (fullScreenInfoCard === id) {
            window.addEventListener("keydown", handleKeyDown);
        } else {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") resetFullScreen();
    }

    let showExtraProjects = false;

    // Project tech filtering
    let selectedTechs: string[] = [];
    let filterOpen = false;
    const allTechs = [...new Set(
        projects.flatMap(p => p.tech ? p.tech.split(",").map((t: string) => t.trim()) : [])
    )].sort();

    function toggleTech(tech: string) {
        if (selectedTechs.includes(tech)) {
            selectedTechs = selectedTechs.filter(t => t !== tech);
        } else {
            selectedTechs = [...selectedTechs, tech];
        }
    }

    $: filteredProjects = selectedTechs.length === 0
        ? projects
        : projects.filter(p => {
            const techList = p.tech ? p.tech.split(",").map((t: string) => t.trim()) : [];
            return selectedTechs.some(t => techList.includes(t));
        });

    $: featuredProjects = filteredProjects.slice(0, 3);
    $: remainingProjects = filteredProjects.slice(3);

    // Track expanded state for each section
    let workExpanded = false;
    let projectsExpanded = false;

    // Toggle expanded state functions
    function toggleWorkExpanded() {
        workExpanded = !workExpanded;
    }

    function toggleProjectsExpanded() {
        projectsExpanded = !projectsExpanded;
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<main class="min-h-screen flex flex-col justify-center items-center bg-grey-800 w-full overflow-x-hidden">
    <!-- Add the fullscreen overlay as an actual DOM element -->
    {#if fullScreenInfoCard}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div 
            class="fullscreen-overlay" 
            on:click={resetFullScreen}
        ></div>
    {/if}

    <div class="max-w-screen-2xl m-3">
        <!-- Menu Bar -->
        {#if isMobile()}
            <div class="drawer drawer-end z-100">
                <input id="my-drawer" type="checkbox" class="drawer-toggle" />
                <div class="absolute right-8 top-4 drawer-content place-items-center flex gap-4">
                    <!-- Page content here -->
                    <label for="my-drawer" class="btn btn-stone-900 bg-transparent drawer-button">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h7"
                            />
                        </svg>
                    </label>

                </div>
                <div class="drawer-side z-10">
                    <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
                    <ul class="menu p-4 w-80 min-h-full bg-zinc-900 opacity-75 text-base-content">
                        <!-- Sidebar content here -->
                        <ul class="menu w-[100%] rounded-box">
                            {#each sections as section}
                                <li class="mt-8">
                                    <a href={null} on:click={() => scrollDownToSection(section.id)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="h-5 w-5 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d={section.data}
                                            />
                                        </svg>
                                        <span class="text-white text-2xl">{section.name}</span>
                                    </a>
                                </li>
                            {/each}
                            <li class="mt-8">
                                <a href="https://homepage.mattvandenberg.com" target="_blank">
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        class="h-5 w-5 text-white" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            stroke-linecap="round" 
                                            stroke-linejoin="round" 
                                            stroke-width="2" 
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                                        />
                                    </svg>
                                    <span class="text-white text-2xl">Homelab</span>
                                    <!-- <span class="badge badge-secondary ml-1 animate-pulse">NEW!</span> -->
                                </a>
                            </li>
                        </ul>
                    </ul>
                </div>
            </div>
        {/if}

        <div class="min-h-screen flex flex-col gap-20 justify-center text-center place-items-center mt-10">
            {#if !isMobile()}
                <!-- Add titles up top -->
                <div class="absolute top-0 w-[100%] max-w-[1600px]">
                    <div class="navbar">
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div class="flex-1">
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <div
                                class="tooltip tooltip-bottom"
                                data-tip="What does this do?"
                                on:click={() => (window.open("https://mattvandenberg.com/mystery.html", "_blank"))}
                            >
                                <!-- svelte-ignore a11y-missing-attribute -->
                                <a class="btn btn-ghost text-xl">Matthew</a>
                            </div>
                        </div>
                        <div class="flex-none">
                            <ul class="menu menu-horizontal px-1">
                                {#each sections as section}
                                    <li>
                                        <a href={null} on:click={() => scrollDownToSection(section.id)}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                class="h-5 w-5 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d={section.data}
                                                />
                                            </svg>
                                            <span class="text-white text-lg">{section.name}</span>
                                        </a>
                                    </li>
                                {/each}
                                <li>
                                    <a href="https://homepage.mattvandenberg.com" target="_blank" class="flex items-center">
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            class="h-5 w-5 text-white" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                        >
                                            <path 
                                                stroke-linecap="round" 
                                                stroke-linejoin="round" 
                                                stroke-width="2" 
                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                                            />
                                        </svg>
                                        <span class="text-white text-lg">Homelab</span>
                                        <span class="badge badge-secondary ml-1 animate-pulse">NEW!</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            {/if}
            
            <!-- Intro -->
            <div class="h-[100px]">
                <div class="avatar ms-24">
                    <div class="w-12 rounded-full animate-ping hover:animate-spin">
                        <img src="https://mattvandenberg.com/matthew.jpg" alt="Matthew" />
                    </div>
                </div>
                <h1 class="text-6xl">Hi!</h1>
            </div>
            <div class="flex flex-col items-center gap-3">
                <h1 class="text-4xl font-bold text-gray-100">I'm</h1>
                <h1 class="text-4xl font-bold text-gray-100">Matthew </h1>
                <h1 class="text-4xl font-bold text-gray-100">Vandenberg!</h1>
            </div>
            <div class="m-6">
                <h2 class="text-xl text-gray-200">Software Engineer at ServiceNow</h2>
                <h2 class="text-xl text-gray-200">Technology & Automation Afficionado</h2>
            </div>

            <!-- Scroll Down Indicator -->
            <div class={`flex justify-center mt-4 ${!showDownArrow && "invisible"}`}>
                <div class="animate-bounce">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>

        <div class="flex flex-col sm:flex-row w-full gap-2 justify-center">
            <!-- Work Experience Section -->
            <section id="work" class="px-4 py-8 w-full sm:w-1/2 text-center">
                <div class="flex justify-center place-items-center gap-3">
                    <h3 class="text-3xl font-bold text-center">Work Experience</h3>
                </div>
                <div class={`mt-6 space-y-6 section-container ${workExpanded ? 'expanded' : 'collapsed'}`}>
                    {#each workExperience as job}
                        {@const isFullScreen = fullScreenInfoCard === job.id}
                        <div
                            class={`card ${isFullScreen ? "fullScreenCard" : ""} transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1`}
                        >
                            <InfoCard
                                fullScreen={isFullScreen}
                                onFullscreenPressed={() => onFullscreenPressed(job)}
                                type="job"
                                displayObject={job}
                            />
                        </div>
                    {/each}
                </div>
                {#if workExperience.length > 2 || isMobile()}
                    <button class="btn text-white btn-outline mt-4 show-more-btn {!workExpanded ? 'show-more-btn-pulse' : ''}" on:click={toggleWorkExpanded}>
                        <span>{workExpanded ? 'Show Less' : 'Show More'}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 btn-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d={workExpanded ? 
                                "M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" : 
                                "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"} 
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>
                {/if}
            </section>

            {#if isMobile()}
                <div class="divider"></div>
            {/if}

            <!-- Education Section -->
            <section id="education" class="px-4 py-8 w-full sm:w-1/2 text-center">
                <div class="flex justify-center place-items-center gap-3">
                    <h3 class="text-3xl font-bold text-center">Education</h3>
                </div>
                <div class={`mt-6 space-y-6`}>
                    {#each schools as school}
                        {@const isFullScreen = fullScreenInfoCard === school.id}
                        <div
                            class={`card ${isFullScreen ? "fullScreenCard" : ""} transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1`}
                        >
                            <InfoCard
                                fullScreen={isFullScreen}
                                onFullscreenPressed={() => onFullscreenPressed(school)}
                                type="education"
                                displayObject={school}
                            />
                        </div>
                    {/each}
                </div>
            </section>
        </div>

        <div class="divider"></div>

        <!-- Projects Section -->
        <section id="projects" class={`px-4 py-8 text-center`}>
            <div class="flex justify-center place-items-center gap-3">
                <h3 class="text-3xl font-bold text-center">Projects</h3>
            </div>
            <!-- Tech filter dropdown -->
            <div class="relative inline-block mt-3">
                <button
                    class="btn btn-sm btn-outline text-gray-400 border-zinc-600 hover:border-zinc-400 gap-2"
                    on:click={() => filterOpen = !filterOpen}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filter{selectedTechs.length > 0 ? ` (${selectedTechs.length})` : ''}
                </button>
                {#if filterOpen}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class="fixed inset-0 z-40" on:click={() => filterOpen = false}></div>
                    <div class="absolute z-50 mt-2 left-1/2 -translate-x-1/2 w-72 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl p-3">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm text-gray-300 font-medium">Technologies</span>
                            {#if selectedTechs.length > 0}
                                <button class="text-xs text-gray-500 hover:text-white transition-colors" on:click={() => selectedTechs = []}>Clear all</button>
                            {/if}
                        </div>
                        <div class="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                            {#each allTechs as tech}
                                <button
                                    class={`badge badge-sm cursor-pointer transition-all duration-200 ${selectedTechs.includes(tech) ? 'badge-primary' : 'badge-outline text-gray-400 border-zinc-600 hover:border-zinc-400'}`}
                                    on:click={() => toggleTech(tech)}
                                >
                                    {tech}
                                </button>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
            <!-- Featured projects (always visible) -->
            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {#each featuredProjects as project}
                    {@const isFullScreen = fullScreenInfoCard === project.id}
                    <div
                        class={`card max-h-full ${isFullScreen ? "fullScreenCard" : ""} transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1`}
                    >
                        <InfoCard
                            fullScreen={isFullScreen}
                            onFullscreenPressed={() => onFullscreenPressed(project)}
                            type="project"
                            displayObject={project}
                        />
                    </div>
                {/each}
            </div>

            <!-- Remaining projects (behind Show More) -->
            {#if remainingProjects.length > 0}
                <div class={`mt-6 section-container projects-container ${projectsExpanded ? 'expanded' : 'collapsed'}`}>
                    <div class="space-y-2 max-w-2xl mx-auto">
                        {#each remainingProjects as project}
                            <div class="flex items-start gap-3 py-3 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors">
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <span class="text-white font-medium">{project.subheading}</span>
                                        {#if project.website}
                                            <a href={project.website} target="_blank" class="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-zinc-700 text-gray-500 hover:text-white transition-colors" on:click|stopPropagation>
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        {/if}
                                        {#if project.github}
                                            <a href={project.github} target="_blank" class="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-zinc-700 text-gray-500 hover:text-white transition-colors" on:click|stopPropagation>
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                                </svg>
                                            </a>
                                        {/if}
                                        <span class="text-gray-500 text-sm">&middot; {project.year}</span>
                                    </div>
                                    <p class="text-sm text-gray-400 mt-0.5">{project.content}</p>
                                    {#if project.tech}
                                        <div class="flex flex-wrap gap-1 mt-1.5">
                                            {#each project.tech.split(",").map((t) => t.trim()) as tech}
                                                <span class="badge badge-xs border-0 {getTechColor(tech)}">{tech}</span>
                                            {/each}
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
                <button class="btn text-white btn-outline mt-4 show-more-btn {!projectsExpanded ? 'show-more-btn-pulse' : ''}" on:click={toggleProjectsExpanded}>
                    <span>{projectsExpanded ? 'Show Less' : 'Show More'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 btn-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d={projectsExpanded ?
                            "M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" :
                            "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"}
                            clip-rule="evenodd"
                        />
                    </svg>
                </button>
            {/if}
        </section>

        <div class="divider"></div>

        <!-- Blogs Section -->
        <h3 class="text-3xl font-bold text-center">Blog</h3>
        <Blog />

        <!-- Footer -->
        <div class="divider"></div>

        <footer class="footer footer-center p-10 text-base-content rounded">
            <nav class="grid grid-flow-col gap-10">
                {#each footer.links as link}
                    <a class="text-gray-400 link link-hover text-gray800" href={link.href} target="_blank">{link.name}</a>
                {/each}
            </nav>
            <nav>
                <div class="grid grid-flow-col gap-6">
                    {#each footer.socials as social}
                        <a
                            href={social.href}
                            class="transition duration-300 ease-in-out transform hover:scale-110 rounded-md p-2"
                            title={social.name}
                            target="_blank"
                        >
                            <img
                                class="transition-opacity duration-300 opacity-70 hover:opacity-100"
                                src={`/ico/${social.svg}`}
                                alt={social.name}
                            />
                        </a>
                    {/each}
                </div>
            </nav>
            <aside>
                <p class="text-[#606368]">
                    {`Copyright © 2023-${currentYear} Matthew Vandenberg. All rights reserved.`}
                </p>
                <p class="text-[#606368]">Made with Svelte + DaisyUI, running with Apache on Ubuntu, somewhere 🤷‍♂️.</p>
            </aside>
        </footer>
    </div>

    <ThreeDBackground />
</main>

<style>
    main {
        width: 100%;
    }
    @keyframes bounce {
        0%,
        20%,
        50%,
        80%,
        100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-30px);
        }
        60% {
            transform: translateY(-15px);
        }
    }
    .animate-bounce {
        animation: bounce 2s infinite;
    }
    :global(.fullScreenCard) {
        z-index: 10001; /* Increased z-index to be above the overlay */
        width: 66vw;
        position: fixed;
        top: 20vh;
        margin: auto;
        left: 17vw;
        max-height: 60vh;
    }

    /* New style for the actual overlay element */
    .fullscreen-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        backdrop-filter: blur(12px);
        background: rgba(0, 0, 0, 0.4);
        z-index: 1000; /* Below the card but above other content */
    }

    @keyframes ping {
        0% {
            transform: scale(0.95);
            opacity: 0.8;
        }
        50% {
            transform: scale(1.05);
            opacity: 1;
        }
        100% {
            transform: scale(0.95);
            opacity: 0.8;
        }
    }

    :global(.animate-ping) {
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    /* Section height control styles */
    .section-container.collapsed {
        max-height: 70vh;
        overflow: hidden;
        position: relative;
        transition: all 0.5s ease;
        border-radius: 0.5rem;
    }
    
    .section-container.collapsed::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 30px;
        background: linear-gradient(to bottom, rgba(28, 25, 23, 0), rgba(24, 21, 21, 0.95));
        pointer-events: none;
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
    }
    
    .section-container.expanded {
        max-height: none;
        transition: all 0.8s ease-in-out;
    }
    
    /* Projects grid specific styling */
    .projects-container.collapsed {
        max-height: 85vh;
    }
    
    /* Ensure smooth transitions */
    .section-container {
        transition: max-height 0.5s ease-in-out;
        padding-bottom: 1rem;
    }
    
    /* Button styling */
    .show-more-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 1rem auto;
        position: relative;
        transition: all 0.3s ease;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        overflow: hidden;
    }
    
    .show-more-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
    
    /* Add shine animation when button is clicked */
    .show-more-btn::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
        );
        transform: rotate(45deg);
        opacity: 0;
        pointer-events: none;
    }
    
    .show-more-btn:active::after {
        opacity: 1;
        animation: shine 0.5s ease-out;
    }
    
    @keyframes shine {
        0% {
            transform: translateX(-100%) rotate(45deg);
            opacity: 0;
        }
        50% {
            opacity: 0.7;
        }
        100% {
            transform: translateX(100%) rotate(45deg);
            opacity: 0;
        }
    }
    
    /* Button icon animation */
    .btn-icon {
        transition: transform 0.3s ease-in-out;
    }
    
    .show-more-btn:active .btn-icon {
        transform: scale(1.2);
    }
    
    /* Subtle pulse animation for the button when section is collapsed */
    .show-more-btn-pulse {
        animation: pulse-subtle 2s infinite;
    }
    
    @keyframes pulse-subtle {
        0% {
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        50% {
            box-shadow: 0 2px 15px rgba(92, 92, 92, 0.4);
        }
        100% {
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
    }
    
    /* Animation for expanding/collapsing sections */
    .section-container {
        transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
                    opacity 0.3s ease,
                    transform 0.3s ease;
    }
    
    .section-container.collapsed {
        transform-origin: top;
    }
    
    .section-container.expanded {
        transform-origin: top;
        opacity: 1;
    }
</style>
