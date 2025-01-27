<script>
  import { onMount } from "svelte";

    let numLines = 1;

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

    let blogAnimationPlayed = false;

    onMount(() => {
        if (localStorage.getItem("blogAnimationPlayed") == "true") {
            blogAnimationPlayed = true;
        }
    });

    // We'll store our random graph data here
    /**
   * @type {any[]}
   */
    let data = [];

    onMount(() => {
        // Generate 10 random nodes with positions in [0,100)% 
        // and a random value in [0,100)
        data = Array.from({ length: 10 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            val: Math.floor(Math.random() * 100)
        }));
    });
</script>

<section id="blog" class="relative px-4 py-8 text-left  min-h-[60vh] flex justify-center place-items-center">
    <!-- Monitor -->
    <div class="relative w-2/5 aspect-[16/10] border-2 border-white flex justify-center rounded-md place-items-center">
        <div>
            {#if numLines <= 1}
                <h3 class="text-3xl font-bold text-center mb-6">Blog</h3>
                <div class="flex flex-col gap-3 justify-center place-items-center">
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <p on:click={() => triggerBlog()} class={`btn bg-[#191e24] hover:bg-[#15191e] hover:border-[#15191e] border-[#191e24] text-white hover:text-white mt-4`}>(New!) Personal Blog</p>
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
</section>

