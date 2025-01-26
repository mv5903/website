<script lang="ts">
  import { footer } from "./assets/footer";
  import { projects } from "./assets/projects";
  import { schools } from "./assets/schools";
  import { sections } from "./assets/sections";
  import { workExperience } from "./assets/workExperience";

  import { isMobile } from "is-mobile";

  import { onMount } from "svelte";

  let showDownArrow = false;
  let showJumpToText = false;
  
  onMount(() => {
    setTimeout(() => {
      showDownArrow = true;
    }, 1000);
    setTimeout(() => {
      showJumpToText = true;
    }, 2000);
  });



  const scrollDownToSection = async (id: string) => {
    let sideBar = document.getElementById("my-drawer") as HTMLInputElement;
    if (sideBar) sideBar.checked = !sideBar.checked
    window.location.href = window.location.origin + '#' + id;
  }; 
</script>

<main class="min-h-screen flex flex-col justify-center items-center bg-grey-800">
  <div class="max-w-[1600px]">
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
              <label for="" class="outline-0 animate-pulse flex place=items-center">
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

    <div class="min-h-screen flex flex-col gap-20 justify-center text-center place-items-center mt-10">

      {#if !isMobile()}
        <!-- Add titles up top -->
         <div class="absolute top-0 w-[100%] max-w-[1600px]">
          <div class="navbar">
            <div class="flex-1">
              <div class="tooltip tooltip-bottom" data-tip="What does this do?" on:click={() => window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"} >
                <a class="btn btn-ghost text-xl">Matthew</a>
              </div>
            </div>
            <div class="flex-none">
              <ul class="menu menu-horizontal px-1">
                {#each sections as section}
                <li>
                  <a href={null} on:click={() => scrollDownToSection(section.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={section.data} /></svg>
                    <span class="text-white text-2xl">{section.name}</span>
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
          <div class="w-12 rounded-full">
            <img src="https://mattvandenberg.com/matthew.JPG" />
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
            <div class="bg-card shadow-xl rounded-lg p-4">
              <div class="flex gap-3 justify-center place-items-center mt-1">
                <div class="avatar">
                  <div class="w-5 h-5 rounded-full">
                    <img src={`/images/${job.image}`} />
                  </div>
                </div>
                {#if job.website}
                  <a class="text-white hover:text-white hover:underline" href={job.website}><h4 class="text-xl font-bold">{job.subheading}</h4></a>
                {:else}
                  <h4 class="text-xl font-bold">{job.subheading}</h4>
                {/if}
              </div>
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
            <div class="bg-card shadow-xl rounded-lg p-4">
              <div class="flex gap-3 justify-center place-items-center mt-1">
                <div class="avatar">
                  <div class="w-5 h-5 rounded-full">
                    <img src={`/images/${school.image}`} />
                  </div>
                </div>
                <h4 class="text-xl font-bold">{school.name}</h4>
              </div>
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
          <div class="bg-card shadow-xl rounded-lg p-4 flex flex-col md:w-[49vw] lg:max-w-[22vw] lg:w-[32vw]">
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
    <section id="blog" class="px-4 py-8 text-left mt-[30vh] min-h-[60vh]">
      <h3 class="text-3xl font-bold text-center">Blog</h3>
      <div class="flex flex-col gap-3 justify-center place-items-center">
        <a href={"https://obsidian.mattvandenberg.com"} target="_blank" class={`btn bg-[#191e24] hover:bg-[#15191e] hover:border-[#15191e] border-[#191e24] text-white hover:text-white mt-4`}>(New!) Personal Blog</a>
        <p>To see my life incrementally with blogs!</p>
      </div>
    </section>
    
    
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
        <p class="text-[#606368]">Copyright © 2023-2025 Matthew Vandenberg. All rights reserved.</p>
      </aside>
    </footer>
  </div>
</main>


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
