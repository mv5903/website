<script lang="ts">
    import isMobile from "is-mobile";
    import { onDestroy, onMount } from "svelte";

    type BlogMeta = {
        title: string;
        slug: string;
        date: string;
        updated: string;
        excerpt: string;
        url: string;
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

    /**
     * Triggers the blog's computer animation. If the animation has already been played,
     * it will redirect to the blog.
     */
    function triggerBlog() {
        if (localStorage.getItem("blogAnimationPlayed") == "true") {
            window.location.href = "https://obsidian.mattvandenberg.com";
        } else {
            localStorage.setItem("blogAnimationPlayed", "true");
            setInterval(() => {
                numLines++;
                if (numLines == 5) {
                    numLines = 1;
                    window.location.href = "https://obsidian.mattvandenberg.com";
                }
            }, 1000);
        }
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

    onMount(() => {
        (async function() {
            // Check if the computer animation has been played
            if (localStorage.getItem("blogAnimationPlayed") == "true") {
                blogAnimationPlayed = true;
            }

            // Fetch the blog posts
            const response = await fetch("https://obsidian.mattvandenberg.com/api/posts.json");
            const data = await response.json();
            let temp = data;
            // Order by date
            temp.sort((a: BlogMeta, b: BlogMeta) => new Date(a.date).getTime() - new Date(b.date).getTime());

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

            // Animate nodes
            resizeObservedElements.forEach((node, index) => {
                setTimeout(() => {
                    node.classList.add('animate');
                }, index * 600);
            });

            // Wait for arrows to be ready
            await waitForArray(arrowElements);

            // Animate arrows
            arrowElements.forEach((arrow, index) => {
                if (arrow) {
                    const length = arrow.getTotalLength();
                    arrow.style.strokeDasharray = length + "";
                    arrow.style.strokeDashoffset = length + ""; // Start fully hidden

                    setTimeout(() => {
                        arrow.classList.add('arrow'); // Trigger animation
                    }, index * 600);
                }
            });
        })();
    });

    onDestroy(() => {
        resizeObservers.forEach((observer) => observer.disconnect());
    });

    window.addEventListener('resize', calculatePositions);
</script>

<style>
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
        transition: transform 0.5s ease-in-out; /* Smooth hover scaling */
    }

    /* Animation class */
    .graph-node.animate {
        animation: fadeInBorder 0.8s ease-in-out forwards;
    }

    /* Keyframes for fade-in border animation */
    @keyframes fadeInBorder {
        0% {
            opacity: 0;
            border-width: 2px;
            border-color: transparent;
        }
        50% {
            opacity: 1;
            border-width: 2px;
            border-color: white;
        }
        100% {
            opacity: 1;
            border-width: 2px;
            border-color: white;
        }
    }

    /* Arrow animation - start with 0 length */
    :global(.arrow) {
        stroke-dasharray: 0;
        animation: drawArrow 0.6s ease-in-out forwards;
        marker-end: none;
    }

    /* Keyframes to animate the arrow drawing */
    @keyframes drawArrow {
        0% {
            stroke-dasharray: 0;
            stroke: white;
        }
        80% {
            stroke-dasharray: var(--arrow-length); /* Full arrow length */
            stroke: white;
        }
        100% {
            stroke-dasharray: var(--arrow-length); /* Full arrow length */
            marker-end: url(#arrowhead);
            stroke: white;
        }
    }
</style>

<section id="blog" class="relative m-8 text-left min-h-[90vh] flex justify-center place-items-center ">
    <!-- Monitor -->
    <div class="relative m-4 h-[35vh] p-4 mb-12 border-2 border-white flex justify-center rounded-md place-items-center z-40 w-full sm:w-1/3">
        <div>
            {#if numLines <= 1}
                <h3 class="text-3xl font-bold text-center mb-6">Blog</h3>
                <div class="flex flex-col gap-3 justify-center place-items-center">
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <p on:click={() => triggerBlog()} class={`btn bg-[#191e24] hover:bg-[#15191e] hover:border-[#15191e] border-[#191e24] text-white hover:text-white mt-4`}>Personal Blog Home</p>
                    <p>To see my life incrementally with blogs!</p>
                </div>
            {/if}
            {#if numLines > 1}
                <div class="flex justify-center place-items-center">
                <div class="mockup-code">
                    {#if numLines > 1}
                        <pre data-prefix="$"><code>ssh blogserver</code></pre>
                    {/if}
                    {#if numLines > 2}
                        <pre data-prefix=">" class="text-warning"><code>Enter Password:</code></pre>
                    {/if}
                    {#if numLines > 3}
                        <pre data-prefix=">" class="text-success"><code>Just kidding...</code></pre>
                    {/if}
                </div>
                </div>
            {/if}
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
                    <h4 class="text-sm font-bold">{node.slug}</h4>
                    <p class="text-sm text-gray-400">{new Date(node.date).toLocaleDateString()}</p>
                    <p
                        bind:this={excerptEls[i]}
                        class="excerpt text-xs"
                    >
                    {node.excerpt}
                    </p>
                    <a class="btn btn-sm" href={node.url}>Read</a>
                </div>
            </div>
            {/each}

            <!-- SVG for arrows -->
            {#if positions.length > 0}
                <svg class="absolute w-full h-full z-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    {#each blogMeta as node, i}
                        {#if i < blogMeta.length - 1}
                            {#if blogLength > 8 && i == 0}
                                <line
                                    x1={arrowPositions[i].x1}
                                    y1={arrowPositions[i].y1}
                                    x2={arrowPositions[i].x2}
                                    y2={arrowPositions[i].y2}
                                    stroke="transparent"
                                    stroke-width="2"
                                    stroke-dasharray="35,10"
                                    bind:this={arrowElements[i]}
                                />         
                                <text x={(arrowPositions[i].x1 + arrowPositions[i].x2)/2.2} y={arrowPositions[i].y1 + 40} stroke="white" stroke-width="1" stroke-opacity=".5">{`(+ ${blogLength - blogMeta.length} more)`}</text>
                            {:else}
                                <line
                                    x1={arrowPositions[i].x1}
                                    y1={arrowPositions[i].y1}
                                    x2={arrowPositions[i].x2}
                                    y2={arrowPositions[i].y2}
                                    stroke="transparent"
                                    stroke-width="2"
                                    bind:this={arrowElements[i]}
                                />
                            {/if}
                        {/if}
                    {/each}
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="white" />
                        </marker>
                    </defs>
                </svg>
            {/if}
        </div>
    {/if}
</section>