<script lang="ts">
    import isMobile from "is-mobile";
    import { onDestroy, onMount } from "svelte";

    type BlogMeta = {
        title: string;
        link: string;
        pubDate: string;
        guid: string;
        description: string;
    }
    
    let numLines = 1;
    let blogAnimationPlayed = false;
    let blogMeta: BlogMeta[] = [];
    let blogLength = 0;
    let excerptEls: any[] = [];
    let positions: any[] = [];
    let resizeObservedElements: HTMLElement[] = [];
    let arrowElements: SVGLineElement[] = [];
    let resizeObservers: ResizeObserver[] = [];
    let arrowPositions: any[] = [];
    let connectorLabelEl: SVGGElement;

    // New state for the blog list modal
    let showBlogListModal = false;
    let allBlogPosts: BlogMeta[] = [];
    
    // Function to toggle the blog list modal
    function toggleBlogListModal() {
        showBlogListModal = !showBlogListModal;
        
        // If opening the modal, prevent scrolling on the body
        if (showBlogListModal) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }
    
    // Function to format date in a nicer way
    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    /**
     * Triggers the blog's computer animation. 
     */
    function triggerBlog() {
        numLines = 1;
        let interval: number | undefined;
        interval = setInterval(() => {
            numLines++;
            if (numLines == 7) {
                clearInterval(interval);
            }
        }, 1000);
    }

    /**
     * Gets the placement of a node in the directed graph
     * @param i The index of the node
     */
    function getPlacement(i: Number) {
        switch (i) {
            case 0:
                return ["start", "start"];
            case 1:
                return ["center", "start"];
            case 2:
                return ["end", "start"];
            case 3:
                return ["end", "center"];
            case 4:
                return ["end", "end"];
            case 5:
                return ["center", "end"];
            case 6:
                return ["start", "end"];
            case 7:
                return ["start", "center"];
            default:
                return ["center", "center"];
        }
    }

    function handleMouseEnter(i: number) {
        excerptEls[i].classList.add('show');
    }

    function handleMouseLeave(i: number) {
        // Remove the “show” class so it collapses
        excerptEls[i].classList.remove('show');
    }


    /**
     * Gets the position of a node in the directed graph
     * @param index The index of the node
     */
    function getNodePosition(index: number) {
        return positions[index] || { x: 0, y: 0 }; // Default position if not calculated yet
    }

    /**
     * Calculates the positions of the arrows connecting the directed graph's nodes
     */
    function calculatePositions() {
        // The container in which the nodes AND the SVG both live:
        const container = document.querySelector('.grid-layout') as HTMLElement;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        positions = blogMeta.map((_, i) => {
            const element = document.getElementById(
            String.fromCharCode(i + "a".charCodeAt(0))
            ) as HTMLElement;
            if (!element) {
                return { x: 0, y: 0, width: 0, height: 0 };
            }
            const rect = element.getBoundingClientRect();

            // Convert from viewport coords to container coords:
            return {
                x: rect.left - containerRect.left,
                y: rect.top  - containerRect.top,
                width:  rect.width,
                height: rect.height
            };
        });
        for (let i = 0; i < blogMeta.length - 1; i++) {
            const arrowDirection = getArrowDirection(i);
            const { x1, y1, x2, y2 } = calculateArrowPosition(i, arrowDirection);
            arrowPositions[i] = { x1, y1, x2, y2 };
        }
    }

    /**
     * Waits for an array to be populated, with a max timeout of 10 seconds
     * @param array The array to wait for
     */
    async function waitForArray(array: any[], maxTimeout = 5000) {
        let maxTimeRemaining = maxTimeout;
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                if (array.length > 0) {
                    clearInterval(interval);
                    resolve(array);
                }
                maxTimeRemaining -= 100;
                if (maxTimeRemaining <= 0) {
                    clearInterval(interval);
                    reject("Wait for array timed out");
                }
            }, 100);
        });
    }

    /**
     * Calculates the position of an arrow connecting two nodes in the directed graph
     * @param i The index of the first node
     * @param direction The direction of the arrow
     * @returns The position of the arrow
     */
    function calculateArrowPosition(i: number, direction: "up" | "down" | "left" | "right"): {"x1": number, "y1": number, "x2": number, "y2": number} {
        switch (direction) {
            case "up":
                let isLast = i + 1 == blogMeta.length;
                if (isLast) return { x1: 0, y1: 0, x2: 0, y2: 0 };
                return {
                    x1: getNodePosition(i).x + getNodePosition(i).width / 2,
                    y1: getNodePosition(i).y,
                    x2: getNodePosition(i + 1).x + getNodePosition(i + 1).width / 2,
                    y2: getNodePosition(i + 1).y + getNodePosition(i + 1).height,
                };
            case "down":
                return {
                    x1: getNodePosition(i).x + getNodePosition(i).width / 2,
                    y1: getNodePosition(i).y + getNodePosition(i).height,
                    x2: getNodePosition(i + 1).x + getNodePosition(i + 1).width / 2,
                    y2: getNodePosition(i + 1).y,
                };
            case "left":
                return {
                    x1: getNodePosition(i).x,
                    y1: getNodePosition(i).y + getNodePosition(i).height / 2,
                    x2: getNodePosition(i + 1).x + getNodePosition(i + 1).width,
                    y2: getNodePosition(i + 1).y + getNodePosition(i + 1).height / 2,
                };
            case "right":
                return {
                    x1: getNodePosition(i).x + getNodePosition(i).width,
                    y1: getNodePosition(i).y + getNodePosition(i).height / 2,
                    x2: getNodePosition(i + 1).x,
                    y2: getNodePosition(i + 1).y + getNodePosition(i + 1).height / 2,
                };
            default: {
                return {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 0,
                };
            }
        }
    }

    /**
     * Gets the direction of an arrow connecting two nodes in the directed graph
     * @param i The index of the node
     */
    function getArrowDirection(i: number): "up" | "down" | "left" | "right" {
        if (i >= 0 && i < 2) return "right";
        if (i >= 2 && i < 4) return "down";
        if (i >= 4 && i < 6) return "left";
        if (i >= 6 && i < 8) return "up";
        return "right";
    }

    /**
     * Parses an RSS feed and returns all items as an array of objects
     * @param rssContent The RSS feed content as a string
     * @returns Array of RSS items
     */
    function parseRssFeed(rssContent: string): BlogMeta[] {
        const items: BlogMeta[] = [];
        
        // Extract all <item> blocks from the RSS content
        const itemRegex = /<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>[\s\S]*?<pubDate>([\s\S]*?)<\/pubDate>[\s\S]*?<guid>([\s\S]*?)<\/guid>[\s\S]*?<description>([\s\S]*?)<\/description>[\s\S]*?<\/item>/g;
        
        // Find all matches
        let match;
        while ((match = itemRegex.exec(rssContent)) !== null) {
            // Create an item object with the extracted values
            const item: BlogMeta = {
            title: decodeXmlEntities(match[1]),
            link: decodeXmlEntities(match[2]),
            pubDate: decodeXmlEntities(match[3]),
            guid: decodeXmlEntities(match[4]),
            description: decodeXmlEntities(match[5])
            };
            
            items.push(item);
        }
        
        return items;
    }

    /**
     * Decodes XML entities in a string
     * @param str String with XML entities
     * @returns Decoded string
     */
    function decodeXmlEntities(str: string): string {
        // Create a temporary element to use the browser's built-in decoder
        const txt = document.createElement("textarea");
        txt.innerHTML = str;
        return txt.value;
    }

    onMount(() => {
        (async function() {
            if (isMobile()) {
                triggerBlog();
                return;
            }  
            // Check if the computer animation has been played
            if (localStorage.getItem("blogAnimationPlayed") == "true") {
                blogAnimationPlayed = true;
            }

            // Fetch the blog posts
            const response = await fetch("https://mattvandenberg.com/blog/posts/index.xml");
            const text = await response.text();
            const data = parseRssFeed(text);
            console.log(data);
            let temp = data;
            // Store all blog posts for use in the modal
            allBlogPosts = [...data].sort((a: BlogMeta, b: BlogMeta) => 
                new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
            );
            // Order by date
            temp.sort((a: BlogMeta, b: BlogMeta) => new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime());

            // If the length is greater than 8, take the very first one, and the last 7
            if (temp.length > 8) {
                temp = [temp[0], ...temp.slice(-7)];
                blogMeta = temp;
            } else {
                blogMeta = data;
            }
            blogLength = data.length;

            // Waits for the elements to be rendered before placing the resize observers
            await waitForArray(resizeObservedElements);

            resizeObservedElements.forEach((element, index) => {
                if (!element) return;

                const resizeObserver = new ResizeObserver((entries) => {
                    for (const entry of entries) {
                        calculatePositions();
                    }
                });
                resizeObserver.observe(element);
                resizeObservers[index] = resizeObserver;
            });

            await waitForArray(arrowElements) 

            // Animate arrows (yes this is stupid)
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Animate nodes - ensure they stay visible with the permanent 'visible' class
                        resizeObservedElements.forEach((node, index) => {
                            setTimeout(() => {
                                node.classList.add('animate');
                                // Add permanent visibility class
                                node.classList.add('visible');
                            }, index * 600);
                        });

                        // Wait for arrows to be ready
                        setTimeout(() => {
                            arrowElements.forEach((arrow, index) => {
                                if (arrow) {
                                    const length = arrow.getTotalLength();
                                    
                                    // Store the length as a CSS variable for use in animation
                                    arrow.style.setProperty('--arrow-length', `${length}`);
                                    
                                    // Initial state: completely hidden with opacity 0
                                    arrow.style.strokeDasharray = `${length}`;
                                    arrow.style.strokeDashoffset = `${length}`;
                                    arrow.style.opacity = "0";
                                    
                                    // Special handling for the first arrow when there are extra posts
                                    if (blogLength > 8 && index === 0) {
                                        // Treat the arrow like other arrows but also show the label
                                        setTimeout(() => {
                                            // Add pulse animation to source node first
                                            const sourceNodeIndex = index;
                                            if (resizeObservedElements[sourceNodeIndex]) {
                                                resizeObservedElements[sourceNodeIndex].classList.add('pulse-before-arrow');
                                            }
                                            
                                            // After node pulse, animate the arrow
                                            setTimeout(() => {
                                                // Make the arrow visible right before animation starts
                                                arrow.style.opacity = "1";
                                                arrow.classList.add('arrow-grow');
                                                
                                                // Also show the connector label
                                                setTimeout(() => {
                                                    if (connectorLabelEl) {
                                                        connectorLabelEl.classList.add('visible');
                                                    }
                                                }, 300);
                                                
                                                // Make sure the arrow stays visible after animation
                                                setTimeout(() => {
                                                    arrow.style.stroke = "white";
                                                }, 1500);
                                                
                                                // After arrow is mostly drawn, pulse the target node
                                                setTimeout(() => {
                                                    const targetNodeIndex = index + 1;
                                                    if (targetNodeIndex < resizeObservedElements.length) {
                                                        resizeObservedElements[targetNodeIndex].classList.add('pulse-after-arrow');
                                                    }
                                                }, 500);
                                            }, 300);
                                        }, index * 800);
                                    } else {
                                        // Wait a bit longer for nodes to become visible
                                        setTimeout(() => {
                                            // Add pulse animation to source node first
                                            const sourceNodeIndex = index;
                                            if (resizeObservedElements[sourceNodeIndex]) {
                                                resizeObservedElements[sourceNodeIndex].classList.add('pulse-before-arrow');
                                            }
                                            
                                            // After node pulse, animate the arrow
                                            setTimeout(() => {
                                                // Make the arrow visible right before animation starts
                                                arrow.style.opacity = "1";
                                                arrow.classList.add('arrow-grow');
                                                
                                                // Make sure the arrow stays visible after animation
                                                setTimeout(() => {
                                                    arrow.style.stroke = "white";
                                                }, 1500);
                                                
                                                // After arrow is mostly drawn, pulse the target node
                                                setTimeout(() => {
                                                    const targetNodeIndex = index + 1;
                                                    if (targetNodeIndex < resizeObservedElements.length) {
                                                        resizeObservedElements[targetNodeIndex].classList.add('pulse-after-arrow');
                                                    }
                                                }, 500);
                                            }, 300);
                                        }, index * 800);
                                    }
                                }
                            });
                        }, 300);
                        observer.unobserve(entry.target); // Stop observing once the animation is triggered
                        triggerBlog();
                    }
                });
            });

            const blogEl = document.getElementById("blog");
            if (!blogEl) return;
            observer.observe(blogEl);
        })();
    });

    onDestroy(() => {
        resizeObservers.forEach((observer) => observer.disconnect());
    });

    window.addEventListener('resize', calculatePositions);
</script>

<style>
    /* Styles that can't be easily expressed with Tailwind */
    .grid-layout {
        display: grid;
        grid-template-areas:
            "a b c"
            "h . d"
            "g f e";
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: auto auto auto;
    }

    .excerpt {
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
        transition: max-height 0.4s ease, max-width 0.4s ease, opacity 0.4s ease-in-out 0.4s;
    }

    .excerpt.show {
        max-height: 300px;
        max-width: 300px;
        opacity: 1;
    }

    /* Initial state */
    .graph-node {
        opacity: 0;
        border-width: 2px;
        border-style: solid;
        border-color: transparent;
        transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                    opacity 0.5s cubic-bezier(0.215, 0.61, 0.355, 1),
                    border-color 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    .graph-node.animate {
        animation: fadeInBorder 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        transform-origin: center;
        opacity: 1;
        border-color: white;
    }

    /* Animation keyframes need to stay as CSS */
    @keyframes pulseNodeBeforeArrow {
        0% { transform: scale(1); box-shadow: 0 0 0 rgba(255, 255, 255, 0); }
        50% { transform: scale(1.08); box-shadow: 0 0 15px rgba(255, 255, 255, 0.5); }
        100% { transform: scale(1); box-shadow: 0 0 0 rgba(255, 255, 255, 0); }
    }

    @keyframes pulseNodeAfterArrow {
        0% { transform: scale(1); box-shadow: 0 0 0 rgba(255, 255, 255, 0); }
        50% { transform: scale(1.1); box-shadow: 0 0 20px rgba(255, 255, 255, 0.7); }
        100% { transform: scale(1); box-shadow: 0 0 0 rgba(255, 255, 255, 0); }
    }

    @keyframes fadeInBorder {
        0% {
            opacity: 0;
            border-color: transparent;
            transform: scale(0.9);
        }
        70% {
            opacity: 1;
            border-color: rgba(255, 255, 255, 0.7);
            transform: scale(1.05);
        }
        100% {
            opacity: 1;
            border-color: white;
            transform: scale(1);
        }
    }

    /* Arrow animations */
    :global(.arrow-grow) {
        animation: drawArrowFluid 1.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
    }

    @keyframes drawArrowFluid {
        0% {
            stroke-dashoffset: var(--arrow-length);
            stroke: rgba(255, 255, 255, 0.5);
            stroke-width: 1.5;
            filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0));
        }
        60% {
            stroke-dashoffset: 0;
            stroke: rgba(255, 255, 255, 0.8);
            stroke-width: 2;
            filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.4));
            marker-end: none;
        }
        70% {
            stroke-dashoffset: 0;
            stroke: white;
            stroke-width: 2.2;
            filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.6));
            marker-end: url(#arrowhead);
        }
        100% {
            stroke-dashoffset: 0;
            stroke: white;
            stroke-width: 2;
            filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.3));
            marker-end: url(#arrowhead);
        }
    }

    /* Simplified dotted line styling */
    .dotted-connector {
        stroke-dasharray: 5, 8;
    }

    /* Connector styling */
    .connector-label {
        font-size: 12px;
        fill: white;
        opacity: 0;
        filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.7));
        transition: opacity 0.5s ease-in-out;
        pointer-events: all;
    }

    .connector-label.visible {
        opacity: 0.9;
    }

    .connector-badge {
        fill: rgba(50, 50, 50, 0.8);
        stroke: white;
        stroke-width: 1;
        stroke-opacity: 0.3;
    }

    .connector-text {
        fill: white;
        font-weight: bold;
        text-shadow: 0 0 3px black;
    }

    /* Badge pulse animation */
    .connector-badge.animated {
        animation: pulse-badge 3s infinite;
    }

    @keyframes pulse-badge {
        0%, 100% {
            filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.5));
        }
        50% {
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.9));
        }
    }

    .connector-badge.animated:hover {
        filter: drop-shadow(0 0 10px rgba(255, 255, 255, 1));
    }

    /* Add this to fix sticky header scrolling issue */
    .modal-box .sticky {
        top: 0;
        padding-top: 1rem;
        margin-top: -1rem;
        background-color: theme('colors.base-300');
        border-top-left-radius: inherit;
        border-top-right-radius: inherit;
    }
    
    /* Line clamping utility for excerpts */
    .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;  
        overflow: hidden;
    }
</style>

<section id="blog" class={`relative m-8 text-left flex flex-col min-h-[90vh] gap-20 justify-center place-items-center`}>
    {#if isMobile()}
        <div class="text-center mt-4">
            <p class="text-lg text-gray-400">Where I document my dumb ideas!</p>
        </div>
    {/if}

    <!-- Monitor -->
    <div class="relative m-4 h-[35vh] p-4 mb-12 border-2 border-white flex justify-center rounded-md place-items-center z-40 w-full sm:w-1/3">
        <div>
            <div class="mockup-code bg-zinc-900 overflow-hidden">
                {#if numLines >= 1}
                    <pre data-prefix="$"><code>ssh blogserver</code></pre>
                {/if}
                {#if numLines >= 2}
                    <pre data-prefix="$"><code>cd ~/blog</code></pre>
                {/if}
                {#if numLines >= 3}
                    <pre data-prefix="$"><code>./start.sh</code></pre>
                {/if}
                {#if numLines >= 4}
                    <pre data-prefix=">" class="text-warning"><code>Enter Password:</code></pre>
                {/if}
                {#if numLines >= 5}
                    <a href="https://mattvandenberg.com/blog/"><pre data-prefix=">" class="text-success underline animate-ping overflow-hidden">Enter Blog Home</pre></a>
                {/if}
            </div>
        </div>
        <!-- Stand -->
        <div class="absolute bottom-[-5%] left-1/2 transform -translate-x-1/2 w-1/12 h-1/5 bg-white rounded-md"></div>
        <!-- Base -->
        <div class="absolute bottom-[-8%] left-1/3 w-1/3 h-1/12 border-2 border-white rounded-md"></div>
        <!-- svelte-ignore a11y-interactive-supports-focus -->
        {#if blogAnimationPlayed}
            <!-- Repeat Button -->
            <!-- svelte-ignore a11y-interactive-supports-focus -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="absolute top-2 right-2 h-1/12 text-white hover:bg-zinc-800 p-2 rounded-md cursor-pointer tooltip" data-tip="Replay animation" on:click={() => {localStorage.setItem("blogAnimationPlayed", "false"); triggerBlog(); }} role="button">
                <svg width="30px" height="30px" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" fill-rule="evenodd" stroke="white" stroke-linecap="round" stroke-linejoin="round" transform="matrix(0 1 1 0 2.5 2.5)">
                        <path d="m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8"/>
                        <path d="m4 1v4h-4" transform="matrix(1 0 0 -1 0 6)"/>
                    </g>
                </svg>
            </div>
        {/if}
    </div>

    <!-- Blog Directed Graph -->
    {#if !isMobile()}
        <div class="absolute w-full h-full p-3 grid-layout">
            <!-- Blog Graph nodes -->
            {#each blogMeta as node, i}
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
                id={`${String.fromCharCode(i + "a".charCodeAt(0))}`}
                class={`group graph-node absolute border-white border-2 rounded-full text-white flex justify-center items-center px-6 py-3 text-center z-100 mx-4`}
                style={`grid-area: ${String.fromCharCode(i + "a".charCodeAt(0))}; place-self: ${getPlacement(i)[1]}; justify-self: ${getPlacement(i)[0]};`}
                on:mouseenter={() => handleMouseEnter(i)}
                on:mouseleave={() => handleMouseLeave(i)}
                bind:this={resizeObservedElements[i]}
            >
                <div class="flex flex-col gap-1 justify-center place-items-center">
                    <h4 class="text-sm font-bold">{node.title}</h4>
                    <p class="text-sm text-gray-400">{new Date(node.pubDate).toLocaleDateString()}</p>
                    <p
                        bind:this={excerptEls[i]}
                        class="excerpt text-xs"
                    >
                    {node.description}
                    </p>
                    <a class="btn btn-sm shadow-md" href={node.guid}>Read</a>
                </div>
            </div>
            {/each}

            <!-- SVG for arrows -->
            {#if positions.length > 0}
                <svg class="absolute w-full h-full z-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    {#each blogMeta as node, i}
                        {#if i < blogMeta.length - 1}
                            {#if blogLength > 8 && i == 0}
                                <!-- Regular arrow connector but with the skip indicator label -->
                                <line
                                    x1={arrowPositions[i].x1}
                                    y1={arrowPositions[i].y1}
                                    x2={arrowPositions[i].x2}
                                    y2={arrowPositions[i].y2}
                                    stroke="white"
                                    stroke-width="2"
                                    opacity="0"
                                    bind:this={arrowElements[i]}
                                />
                                <!-- Enhanced connector label with count of skipped posts - now clickable -->
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <g class="connector-label cursor-pointer" bind:this={connectorLabelEl} on:click={toggleBlogListModal}>
                                    <rect 
                                        class="connector-badge animated"
                                        x={(arrowPositions[i].x1 + arrowPositions[i].x2)/2 - 55} 
                                        y={arrowPositions[i].y1 + 15} 
                                        width="110" 
                                        height="30" 
                                        rx="15" 
                                        ry="15" 
                                    />
                                    <text 
                                        class="connector-text"
                                        x={(arrowPositions[i].x1 + arrowPositions[i].x2)/2} 
                                        y={arrowPositions[i].y1 + 35} 
                                        text-anchor="middle" 
                                        font-size="14"
                                    >
                                        +{blogLength - blogMeta.length} more
                                    </text>
                                </g>
                            {:else}
                                <!-- Regular arrow connector -->
                                <line
                                    x1={arrowPositions[i].x1}
                                    y1={arrowPositions[i].y1}
                                    x2={arrowPositions[i].x2}
                                    y2={arrowPositions[i].y2}
                                    stroke="white"
                                    stroke-width="2"
                                    opacity="0"
                                    bind:this={arrowElements[i]}
                                />
                            {/if}
                        {/if}
                    {/each}
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="white" />
                        </marker>
                        <!-- Add a filter for glow effect -->
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                </svg>
            {/if}
        </div>
    {/if}

    <!-- Blog List Modal -->
    {#if showBlogListModal}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="modal modal-open bg-stone-900 mb-4">
            <div class="absolute mx-4 rounded-lg shadow-lg bg-stone-900 max-w-7xl">
                <div class="sticky top-0 bg-stone-900 z-10">
                    <h2 class="text-2xl font-bold text-white text-center mt-3">{`All Blog Posts (${allBlogPosts.length})`}</h2>
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-0" on:click={toggleBlogListModal}>✕</button>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-stone-900 rounded-md m-2 p-4">
                    {#each allBlogPosts as post}
                        <div class="card bg-stone-800 shadow-xl hover:shadow-2xl transition-all">
                            <div class="card-body p-4 justify-start">
                                <h2 class="card-title text-base">{post.title}</h2>
                                <p class="text-xs text-gray-400">{formatDate(post.pubDate)}</p>
                                <p class="text-sm text-gray-300 overflow-hidden line-clamp-3">
                                    {post.description}
                                </p>
                                <div class="card-actions justify-end mt-2">
                                    <a href={post.guid} target="_blank" class="btn btn-sm">Read</a>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
            
            <!-- Modal backdrop that closes modal when clicked -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <label class="modal-backdrop" for="modal-control" on:click={toggleBlogListModal}></label>
        </div>
    {/if}
</section>