<script lang="ts">
  import { blogs } from "./assets/blogs";
  import { footer } from "./assets/footer";
  import { projects } from "./assets/projects";
  import { schools } from "./assets/schools";
  import { sections } from "./assets/sections";
  import { workExperience } from "./assets/workExperience";

  import { isMobile } from "is-mobile";

  import { onMount } from "svelte";

  import Blog from "./Blog.svelte";

  let showDownArrow = false;
  let showJumpToText = false;
  let currentBlog: object | null = null;
  
  onMount(() => {
    setTimeout(() => {
      showDownArrow = true;
    }, 1000);
    setTimeout(() => {
      showJumpToText = true;
    }, 2000);
    const params = new URLSearchParams(window.location.search);
    let blogName = params.get('blog') || null;
    if (blogName) {
      let blog = blogs.find(b => b.blog === blogName);
      if (blog) {
        currentBlog = blog;
      }
    }
  });

  let loaded = false;

  const loadImage = (src : string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const htmlElement = document.querySelector('html');
  if (htmlElement) htmlElement.style.opacity = '0.95';

  loadImage('/images/matthew.jpeg')
    .then(() => {
      loaded = true;
      if (htmlElement) htmlElement.style.opacity = '1';
    })
    .catch(error => {
      loaded = true;
      if (htmlElement) htmlElement.style.opacity = '1';
      console.error('Image failed to load', error);
    });

  const scrollDownToSection = async (id: string) => {
    let sideBar = document.getElementById("my-drawer") as HTMLInputElement;
    if (sideBar) sideBar.checked = !sideBar.checked
    window.location.href = window.location.origin + '#' + id;
  }; 


  function updateCurrentBlog(blog: any) {
    if (!blog) {
      // Reset url
      window.location.href = window.location.origin;
      currentBlog = null;
    } else {
      // Add query param to url
      const params = new URLSearchParams(window.location.search);
      params.set('blog', blog.blog);
      const newURL = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newURL);
      currentBlog = blog;
    }

  }
</script>

{#if !loaded}
  <div class="fixed top-0 left-0 w-screen h-screen flex justify-center items-center opacity-10">
    <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
  </div>
{:else}
  {#if currentBlog}
    <Blog blog={currentBlog} backToHome={() => { updateCurrentBlog(null) }} />
  {:else}
    <main class="min-h-screen flex flex-col justify-center bg-stone-950">
        <!-- Menu Bar -->
        {#if isMobile()}
          <div class="drawer z-100">
            <input id="my-drawer" type="checkbox" class="drawer-toggle" />
            <div class="absolute left-4 top-4 drawer-content place-items-center flex gap-4">
              <!-- Page content here -->
              <label for="my-drawer" class="btn btn-stone-900 bg-stone-900 drawer-button">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
              </label>
              {#if showJumpToText}
                <label for="" class="bg-stone-950 outline-0 animate-pulse flex place=items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
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
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={section.data} /></svg>
                        <span class="text-white text-2xl">{section.name}</span>
                      </a>
                    </li>
                  {/each}
                </ul>
              </ul>
            </div>
          </div>
        {/if}

      <div class="min-h-screen flex flex-col gap-3 justify-center text-center place-items-center">

        <!-- Avatar -->
        <div class="h-[40vh] mb-4">
          <img class="h-[40vh] rounded-xl flex justify-center mb-10" src={`/images/matthew.jpeg`} alt="Matthew Vandenberg" loading="lazy"  />
        </div>

        <!-- Intro -->
        <h1 class="text-4xl font-boldtext-gray-100">Matthew</h1>
        <h1 class="text-4xl font-boldtext-gray-100">Vandenberg</h1>
        <h2 class="text-xltext-gray-200">Incoming Software Engineer at ServiceNow</h2>
        <h2 class="text-xltext-gray-200">Senior at Rutgers University</h2>

        <!-- Scroll Down Indicator -->
        <div class={`flex justify-center mt-4 ${!showDownArrow && 'invisible'}`}>
          <div class="animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="flex flex-col sm:flex-row w-full gap-2 justify-center">
        <!-- Work Experience Section -->
        <section id="work" class="px-4 py-8 w-full sm:w-1/2 text-center">
          <h3 class="text-3xl font-bold text-center">Work Experience</h3>
          <div class="mt-6 space-y-6">
            {#each workExperience as job}
              <div class="bg-stone-800 shadow-xl rounded-lg p-4">
                {#if job.website}
                  <a class="text-white hover:text-white hover:underline" href={job.website}><h4 class="text-xl font-bold">{job.subheading}</h4></a>
                {:else}
                  <h4 class="text-xl font-bold">{job.subheading}</h4>
                {/if}
                <div class="flex justify-center">
                  <p class="text-gray-200">{job.location.substring(0, job.location.indexOf("-"))} <span class="italic">{job.location.substring(job.location.indexOf("-"))}</span></p>
                </div>
                <p class="text-gray-400">{job.date}</p>
                {#each job.content.split("\n") as bullet}
                  <p class="text-gray-300">{bullet}</p>
                {/each}
                {#if job.tech}
                  <p class="text-gray-400 mt-2">{job.tech}</p>
                {/if}
              </div>
            {/each}
          </div>
        </section>
      
        <!-- Education Section -->
        <section id="education" class="px-4 py-8 w-full sm:w-1/2 text-center">
          <h3 class="text-3xl font-bold text-center">Education</h3>
          <div class="mt-6 space-y-6">
            {#each schools as school}
              <div class="bg-stone-800 shadow-xl rounded-lg p-4">
                <h4 class="text-xl font-bold">{school.name}</h4>
                <p class="text-gray-200">{school.location}</p>
                <p class="text-gray-400">{school.timeline}</p>
                <p class="text-gray-300">{school.degree}{school.major ? ' - ' + school.major : ''}</p>
              </div>
            {/each}
          </div>
        </section>
      </div>
      
      <!-- Projects Section -->
      <section id="projects" class="px-4 py-8 text-center">
        <h3 class="text-3xl font-bold text-center">Projects</h3>
        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each projects as project}
            <div class="bg-stone-800 shadow-xl rounded-lg p-4 flex flex-col md:w-[49vw] lg:w-[32vw]">
              <h4 class="text-xl font-bold">{project.subheading}</h4>
              <p class="text-md text-gray-400">{project.year}</p>
              <p class="text-gray-300 flex-grow">{project.content}</p>
              {#if project.tech}
                <p class="text-gray-400 mt-2">{project.tech}</p>
              {/if}
              {#if project.github || project.website || project.blog}
                <div class="flex justify-between gap-3 w-full">
                  {#if project.website}
                    <a href={project.website} target="_blank" class={`btn bg-[#191e24] hover:bg-[#15191e] hover:border-[#15191e] border-[#191e24] text-white hover:text-white mt-4 flex-grow`}>View Project</a>
                  {/if}
                  {#if project.github}
                    <a href={project.github} target="_blank" class={`btn bg-[#191e24] hover:bg-[#15191e] hover:border-[#15191e] border-[#191e24] text-white hover:text-white mt-4 flex-grow`}>Source Code</a>
                  {/if}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </section>

      <!-- Blogs Section -->
      <section id="blog" class="px-4 py-8 text-left">
        <h3 class="text-3xl font-bold text-center">Blog</h3>
        <div class="flex justify-center mt-4">
          <ol class="relative border-s border-gray-700">
            {#each blogs as blog}
            <li class="mb-10 ms-4">
              <div class="absolute w-3 h-3rounded-full mt-1.5 -start-1.5 border border-gray-900 bg-gray-700"></div>
              <time class="mb-1 text-sm font-normal leading-none text-gray-500">{blog.date}</time>
              <h3 class="text-lg font-semibold text-white">{blog.title}</h3>
              <p class="mb-4 text-base font-normal text-gray-400">{blog.description}</p>
              <button on:click={() => updateCurrentBlog(blog) } class="inline-flex items-center px-4 py-2 text-sm font-medium  border  rounded-lg focus:z-10 focus:ring-4 focus:outline-none bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700 focus:ring-gray-700">Read <svg class="w-3 h-3 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
              </button>
            </li>
            {/each}
          </ol>
        </div>
      </section>
      
      
      <!-- Footer -->
      <footer class="footer footer-center p-10 bg-[#191e24] text-base-content rounded">
        <nav class="grid grid-flow-col gap-6">
          {#each footer.links as link}
            <a class="link link-hover text-gray-500" href={link.href} target="_blank">{link.name}</a>
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
          <p class="text-[#a6adba]">Copyright © 2023-2024 Matthew Vandenberg. All rights reserved.</p>
        </aside>
      </footer>
    </main>
  {/if}
{/if}


<style>
  main {
    width: 100%;
  }
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
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
</style>
