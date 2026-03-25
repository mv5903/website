<script lang="ts">
    import { onMount } from "svelte";

    type BlogMeta = {
        title: string;
        link: string;
        pubDate: string;
        guid: string;
        description: string;
    }

    let blogPosts: BlogMeta[] = [];
    let loading = true;

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function parseRssFeed(rssContent: string): BlogMeta[] {
        const items: BlogMeta[] = [];
        const itemRegex = /<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>[\s\S]*?<pubDate>([\s\S]*?)<\/pubDate>[\s\S]*?<guid>([\s\S]*?)<\/guid>[\s\S]*?<description>([\s\S]*?)<\/description>[\s\S]*?<\/item>/g;

        let match;
        while ((match = itemRegex.exec(rssContent)) !== null) {
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

    function decodeXmlEntities(str: string): string {
        const txt = document.createElement("textarea");
        txt.innerHTML = str;
        return txt.value;
    }

    onMount(async () => {
        try {
            const response = await fetch("https://mattvandenberg.com/blog/posts/index.xml");
            const text = await response.text();
            const data = parseRssFeed(text);
            blogPosts = data.sort((a, b) =>
                new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
            );
        } catch (e) {
            console.error("Failed to fetch blog posts:", e);
        } finally {
            loading = false;
        }
    });
</script>

<section id="blog" class="px-4 py-8 w-full max-w-3xl mx-auto">
    {#if loading}
        <div class="flex justify-center py-12">
            <span class="loading loading-spinner loading-lg text-gray-400"></span>
        </div>
    {:else if blogPosts.length === 0}
        <p class="text-center text-gray-400">No posts yet.</p>
    {:else}
        <!-- Featured Post -->
        <a href={blogPosts[0].guid} class="block group">
            <div class="card bg-zinc-900 border border-zinc-700 hover:border-zinc-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 mb-8">
                <div class="card-body">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="badge badge-sm badge-outline text-gray-400">Latest</span>
                        <span class="text-sm text-gray-500">{formatDate(blogPosts[0].pubDate)}</span>
                    </div>
                    <h4 class="card-title text-2xl text-white group-hover:text-gray-200 transition-colors">{blogPosts[0].title}</h4>
                    <p class="text-gray-400 mt-2 line-clamp-3">{blogPosts[0].description}</p>
                    <div class="card-actions justify-end mt-4">
                        <span class="text-sm text-gray-500 group-hover:text-white transition-colors">Read &rarr;</span>
                    </div>
                </div>
            </div>
        </a>

        <!-- Remaining Posts with Timeline -->
        {#if blogPosts.length > 1}
            <div class="relative pl-8">
                <!-- Timeline line -->
                <div class="timeline-line"></div>

                {#each blogPosts.slice(1) as post, i}
                    <a href={post.guid} class="group relative flex items-start py-4 hover:bg-zinc-900/50 px-3 rounded-lg transition-colors">
                        <!-- Timeline dot -->
                        <div class="timeline-dot group-hover:scale-125 group-hover:border-white group-hover:bg-zinc-700 {i === 0 ? 'border-white' : ''}"></div>

                        <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 flex-1 min-w-0">
                            <span class="text-sm text-gray-500 shrink-0 sm:w-40">{formatDate(post.pubDate)}</span>
                            <div class="flex-1 min-w-0 relative">
                                <h5 class="text-white group-hover:text-gray-200 transition-colors font-medium truncate">{post.title}</h5>
                                <p class="text-sm text-gray-500 mt-0.5 truncate">{post.description}</p>
                                <div class="post-description-popover">
                                    <p class="text-sm text-gray-400">{post.description}</p>
                                </div>
                            </div>
                            <span class="text-sm text-gray-600 group-hover:text-white transition-colors hidden sm:block">&rarr;</span>
                        </div>
                    </a>
                {/each}
            </div>
        {/if}

        <!-- View All -->
        <div class="text-center mt-8">
            <a href="https://mattvandenberg.com/blog/posts/" class="btn btn-outline btn-sm text-gray-400 hover:text-white">
                View all posts
            </a>
        </div>
    {/if}
</section>

<style>
    .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .timeline-line {
        position: absolute;
        left: 15px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: linear-gradient(to bottom, rgba(113, 113, 122, 0.5), rgba(113, 113, 122, 0.1));
    }

    .post-description-popover {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgb(39, 39, 42);
        border: 1px solid rgb(63, 63, 70);
        border-radius: 0.5rem;
        padding: 0.75rem;
        z-index: 10;
        opacity: 0;
        pointer-events: none;
        transform: translateY(-4px);
        transition: opacity 0.2s ease, transform 0.2s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }

    :global(.group:hover) .post-description-popover {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(4px);
    }

    .timeline-dot {
        position: absolute;
        left: -21px;
        top: 22px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2px solid rgb(113, 113, 122);
        background: rgb(24, 24, 27);
        transition: all 0.2s ease;
        z-index: 1;
    }
</style>
