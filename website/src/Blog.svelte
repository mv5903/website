<script>
    // @ts-nocheck
    export let blog;
    export let backToHome;

    function countWords(input) {
    // Match all words in the input string, considering sequences separated by whitespace or punctuation
        const words = input.trim().match(/\b\w+\b/g);
        // Return the length of the array or 0 if no words are found
        return words ? words.length : 0;
    }

    const WPM = 200;

    let currentBlogHtml = "";
    let approxReadingTime = 0;
    let loaded = false;

    import { onMount } from 'svelte';
    onMount(() => {
        if (!blog) {
            backToHome();
        }
        fetch(`https://mattvandenberg.com/blogs`)
            .then((res) => res.json())
            .then((data) => {
                currentBlogHtml = data.find((b) => b.name === blog.blog).content;
                approxReadingTime = Math.ceil(countWords(currentBlogHtml) / WPM);
                loaded = true;
            });
    });
</script>

<main>
    {#if !loaded}
        <div class="fixed top-0 left-0 w-screen h-screen flex justify-center items-center opacity-10">
            <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
    {:else}
        <div class="navbar bg-base-300 flex justify-around gap-3">
            <button class="btn bg-card text-white" on:click={backToHome}>
                {'< Back to Home'}
            </button>
            <h6 id="title" class="text-center">{String(blog.title).charAt(0).toUpperCase() + String(blog.title).slice(1)}</h6>
            <p></p>
        </div>
        <div class="max-w-[1500px] mx-auto pt-3 pb-6 px-4">
            <p class="text-left text-base-400">(Approx. {approxReadingTime} minute read)</p>
            {@html currentBlogHtml}
        </div>
    {/if}
</main>