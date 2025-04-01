<script lang="ts">
    import { footer } from "./assets/footer";
    import { projects } from "./assets/projects";
    import { schools } from "./assets/schools";
    import { sections } from "./assets/sections";
    import { workExperience } from "./assets/workExperience";

    import { isMobile } from "is-mobile";

    import { onMount } from "svelte";
    import Blog from "./Blog.svelte";
    import InfoCard from "./InfoCard.svelte";
    import Runners from "./Runners.svelte";

    let showDownArrow = false;
    let showJumpToText = false;

    let currentYear = new Date().getFullYear();

    onMount(() => {
        setTimeout(() => {
            showDownArrow = true;
        }, 1000);
        setTimeout(() => {
            showJumpToText = true;
        }, 2000);

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

    let closedInfoCards: string[] = [];
    let fullScreenInfoCard: string = "";
    let minimizedInfoCards: string[] = [];

    function onClosePressed(displayObject: any) {
        if (isMobile()) return;
        const id = displayObject.id;

        // Toggle the id in the closedInfoCards array
        if (closedInfoCards.includes(id)) {
            closedInfoCards = closedInfoCards.filter((item) => item !== id);
        } else {
            closedInfoCards = [...closedInfoCards, id];
        }
    }

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

    function onMinimizePressed(displayObject: any) {
        if (isMobile()) return;
        const id = displayObject.id;

        // Toggle the id in the minimizedInfoCards array
        if (minimizedInfoCards.includes(id)) {
            minimizedInfoCards = minimizedInfoCards.filter((item) => item !== id);
        } else {
            minimizedInfoCards = [...minimizedInfoCards, id];
        }
    }

    let showExtraProjects = false;

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
            <div class="drawer z-100">
                <input id="my-drawer" type="checkbox" class="drawer-toggle" />
                <div class="absolute left-4 top-4 drawer-content place-items-center flex gap-4">
                    <!-- Page content here -->
                    <label for="my-drawer" class="btn btn-stone-900 bg-stone-900 drawer-button">
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
                    {#if showJumpToText}
                        <label for="" class="outline-0 animate-pulse flex place=items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                                />
                            </svg>
                            <span class="ms-2">Jump To</span>
                        </label>
                    {/if}
                </div>
                <div class="drawer-side z-10">
                    <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
                    <ul class="menu p-4 w-80 min-h-full bg-stone-900 text-base-content">
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
                            </ul>
                        </div>
                    </div>
                </div>
            {/if}
            
            <!-- Intro -->
            <div class="h-[100px]">
                <div class="avatar ms-24">
                    <div class="w-12 rounded-full animate-ping">
                        <img src="https://mattvandenberg.com/matthew.JPG" alt="Matthew" />
                    </div>
                </div>
                <h1 class="text-6xl">Hi!</h1>
            </div>
            <div>
                <h1 class="text-4xl font-boldtext-gray-100">I'm</h1>
                <h1 class="text-4xl font-boldtext-gray-100">Matthew</h1>
                <h1 class="text-4xl font-boldtext-gray-100">Vandenberg!</h1>
            </div>
            <div class="m-6">
                <h2 class="text-xltext-gray-200">An Incoming Software Engineer at ServiceNow</h2>
                <h2 class="text-xltext-gray-200">Finishing My Last Semester at Rutgers University</h2>
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
                    {#if closedInfoCards.some((id) => id.startsWith("W"))}
                        <button
                            class="btn btn-sm animate-ping"
                            on:click={() => (closedInfoCards = closedInfoCards.filter((id) => !id.startsWith("W")))}
                        >
                            <span>Reset</span>
                        </button>
                    {/if}
                </div>
                <div class={`mt-6 space-y-6 section-container ${workExpanded ? 'expanded' : 'collapsed'}`}>
                    {#each workExperience as job}
                        {@const isClosed = closedInfoCards.includes(job.id)}
                        {@const isMinimized = minimizedInfoCards.includes(job.id)}
                        {@const isFullScreen = fullScreenInfoCard === job.id}
                        <div
                            class={`card ${isClosed ? "closedCard" : ""} ${isMinimized ? "minimizedCard" : ""} ${isFullScreen ? "fullScreenCard" : ""} transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1`}
                        >
                            <InfoCard
                                fullScreen={isFullScreen}
                                minimized={isMinimized}
                                onClosePressed={() => onClosePressed(job)}
                                onFullscreenPressed={() => onFullscreenPressed(job)}
                                onMinimizePressed={() => onMinimizePressed(job)}
                                type="job"
                                displayObject={job}
                            />
                        </div>
                    {/each}
                </div>
                {#if workExperience.length > 2 || isMobile()}
                    <button class="btn btn-outline mt-4 show-more-btn {!workExpanded ? 'show-more-btn-pulse' : ''}" on:click={toggleWorkExpanded}>
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

            <!-- Education Section -->
            <section id="education" class="px-4 py-8 w-full sm:w-1/2 text-center">
                <div class="flex justify-center place-items-center gap-3">
                    <h3 class="text-3xl font-bold text-center">Education</h3>
                    {#if closedInfoCards.some((id) => id.startsWith("S"))}
                        <button
                            class="btn btn-sm animate-ping"
                            on:click={() => (closedInfoCards = closedInfoCards.filter((id) => !id.startsWith("S")))}
                        >
                            <span>Reset</span>
                        </button>
                    {/if}
                </div>
                <div class={`mt-6 space-y-6`}>
                    {#each schools as school}
                        {@const isClosed = closedInfoCards.includes(school.id)}
                        {@const isMinimized = minimizedInfoCards.includes(school.id)}
                        {@const isFullScreen = fullScreenInfoCard === school.id}
                        <div
                            class={`card ${isClosed ? "closedCard" : ""} ${isMinimized ? "minimizedCard" : ""} ${isFullScreen ? "fullScreenCard" : ""}  transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1`}
                        >
                            <InfoCard
                                fullScreen={isFullScreen}
                                minimized={isMinimized}
                                onClosePressed={() => onClosePressed(school)}
                                onFullscreenPressed={() => onFullscreenPressed(school)}
                                onMinimizePressed={() => onMinimizePressed(school)}
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
                {#if closedInfoCards.some((id) => id.startsWith("P"))}
                    <button
                        class="btn btn-sm animate-ping"
                        on:click={() => (closedInfoCards = closedInfoCards.filter((id) => !id.startsWith("P")))}
                    >
                        <span>Reset</span>
                    </button>
                {/if}
            </div>
            <div
                class={`mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 section-container projects-container ${projectsExpanded ? 'expanded' : 'collapsed'}`}
            >
                {#each projects as project, num}
                    {@const isClosed = closedInfoCards.includes(project.id)}
                    {@const isMinimized = minimizedInfoCards.includes(project.id)}
                    {@const isFullScreen = fullScreenInfoCard === project.id}
                    <div
                        class={`card max-h-full ${isClosed ? "closedCard" : ""} ${isMinimized ? "minimizedCard" : ""} ${isFullScreen ? "fullScreenCard" : ""}  transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1`}
                    >
                        <InfoCard
                            fullScreen={isFullScreen}
                            minimized={isMinimized}
                            onClosePressed={() => onClosePressed(project)}
                            onFullscreenPressed={() => onFullscreenPressed(project)}
                            onMinimizePressed={() => onMinimizePressed(project)}
                            type="project"
                            displayObject={project}
                        />
                    </div>
                {/each}
            </div>
            {#if projects.length > (isMobile() ? 3 : 6)}
                <button class="btn btn-outline mt-4 show-more-btn {!projectsExpanded ? 'show-more-btn-pulse' : ''}" on:click={toggleProjectsExpanded}>
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
            <nav class="grid grid-flow-col gap-6">
                {#each footer.links as link}
                    <a class="link link-hover text-gray800" href={link.href} target="_blank">{link.name}</a>
                {/each}
            </nav>
            <nav>
                <div class="grid grid-flow-col gap-6">
                    {#each footer.socials as social}
                        <a
                            href={social.href}
                            class="transition duration-300 ease-in-out transform hover:scale-110 hover:bg-gray-600 rounded-md p-2"
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
    :global(.closedCard) {
        display: none;
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
