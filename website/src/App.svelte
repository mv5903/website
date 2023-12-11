<script lang="ts">
  import { footer } from "./assets/footer";
  import { workExperience } from "./assets/workExperience";
  import { schools } from "./assets/schools";
  import { projects } from "./assets/projects";
  import { blogs } from "./assets/blogs";

  import { onMount } from "svelte";
  let showDownArrow = false;
  onMount(() => {
    setTimeout(() => {
      showDownArrow = true;
    }, 1000);
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

  function calculateButtonWidth(project: any) {
    const count = ['github', 'website', 'blog'].filter((key : any) => project[key]).length;
    switch (count) {
      case 1: return 'w-full'; // 100% width if only one button
      case 2: return 'w-[49%]'; // 50% width if two buttons
      case 3: return 'w-[31%]'; // 33.33% width if three buttons
      default: return 'w-0';  // 0% width if no buttons (should not happen)
    }
  }
</script>

{#if !loaded}
  <div class="fixed top-0 left-0 w-screen h-screen flex justify-center items-center opacity-10">
    <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
  </div>
{:else}
  <main class="min-h-screen flex flex-col justify-center">
    <div class="min-h-screen flex flex-col gap-3 justify-center text-center place-items-center">

      <!-- Avatar -->
      <div class="h-[15vh] sm:h-[30vh] mb-4">
        <img class="h-[15vh] sm:h-[30vh] rounded-xl flex justify-center mb-10" src={`/images/matthew.jpeg`} alt="Matthew Vandenberg" loading="lazy"  />
      </div>

      <!-- Intro -->
      <h2 class="text-lgtext-gray-300">Hi, I'm</h2>
      <h1 class="text-4xl font-boldtext-gray-100">Matthew Vandenberg</h1>
      <h2 class="text-xltext-gray-200">Full Stack Developer at Mirion Technologies</h2>
      <h2 class="text-xltext-gray-200">Student at Rutgers University</h2>

      <!-- Scroll Down Indicator -->
      <div class={`flex justify-center mt-32 ${!showDownArrow && 'invisible'}`}>
        <div class="animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
    
    <div class="flex flex-col sm:flex-row w-full gap-2 justify-center">
      <!-- Work Experience Section -->
      <section class="px-4 py-8 w-full sm:w-1/2">
        <h3 class="text-3xl font-bold text-center">Work Experience</h3>
        <div class="mt-6 space-y-6">
          {#each workExperience as job}
            <div class="bg-background shadow-xl rounded-lg p-4">
              {#if job.website}
                <a class="text-white hover:text-white hover:underline" href={job.website}><h4 class="text-xl font-bold">{job.subheading}</h4></a>
              {:else}
                <h4 class="text-xl font-bold">{job.subheading}</h4>
              {/if}
              <p class="text-gray-400">{job.date}</p>
              <p class="text-gray-300">{job.content}</p>
              {#if job.tech}
                <p class="text-gray-400 mt-2">{job.tech}</p>
              {/if}
            </div>
          {/each}
        </div>
      </section>
    
      <!-- Work Experience Section -->
      <section class="px-4 py-8 w-full sm:w-1/2">
        <h3 class="text-3xl font-bold text-center">Education</h3>
        <div class="mt-6 space-y-6">
          {#each schools as school}
            <div class="bg-background shadow-xl rounded-lg p-4">
              <h4 class="text-xl font-bold">{school.name}</h4>
              <p class="text-gray-400">{school.location}</p>
              <p class="text-gray-400">{school.timeline}</p>
              <p class="text-gray-200">{school.degree}</p>
              {#if school.major}
                <p class="text-gray-200">{school.major}</p>
              {/if}
            </div>
          {/each}
        </div>
      </section>
    </div>

    
    <!-- Projects Section -->
    <section class="px-4 py-8">
      <h3 class="text-3xl font-bold text-center">Projects</h3>
      <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each projects as project}
          <div class="bg-background shadow-xl rounded-lg p-4 flex flex-col">
            <h4 class="text-xl font-bold">{project.subheading}</h4>
            <p class="text-md text-gray-400">{project.year}</p>
            <p class="text-gray-300 flex-grow">{project.content}</p>
            {#if project.tech}
              <p class="text-gray-400 mt-2">{project.tech}</p>
            {/if}
            {#if project.github || project.website || project.blog}
              <div class="flex justify-between gap-3">
                {#if project.website}
                  <a href={project.website} target="_blank" class={`btn bg-[#191e24] hover:bg-[#15191e] hover:border-[#15191e] border-[#191e24] ${calculateButtonWidth(project)} text-white hover:text-white mt-4`}>View Project</a>
                {/if}
                {#if project.github}
                  <a href={project.github} target="_blank" class={`btn bg-[#191e24] hover:bg-[#15191e] hover:border-[#15191e] border-[#191e24] ${calculateButtonWidth(project)} text-white hover:text-white mt-4`}>Source Code</a>
                {/if}
                {#if project.blog}
                  <a href={`http://home.mattvandenberg.com:3000/blog/${project.blog}`} target="_blank" class={`btn bg-[#191e24] hover:bg-[#15191e] hover:border-[#15191e] border-[#191e24] ${calculateButtonWidth(project)} text-white hover:text-white mt-4`}>Read Blog</a>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </section>

    <!-- Blogs Section -->
    <section class="px-4 py-8 text-left">
      <h3 class="text-3xl font-bold text-center">Blog</h3>
      <div class="flex justify-center mt-4">
        <ol class="relative border-s border-gray-200 dark:border-gray-700">
          {#each blogs as blog}
          <li class="mb-10 ms-4">
            <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
            <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{blog.date}</time>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{blog.title}</h3>
            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{blog.description}</p>
            <a href={`http://home.mattvandenberg.com:3000/blog/${blog.blog}`} target="_blank" class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">Read <svg class="w-3 h-3 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg></a>
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
        <p class="text-[#a6adba]">Copyright © 2023 - Matthew Vandenberg. All rights reserved.</p>
      </aside>
    </footer>
  </main>
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
