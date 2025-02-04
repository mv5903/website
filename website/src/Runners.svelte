<script lang="ts">
    import { onMount } from 'svelte';
  
    const runnerCount = 12;
    const intervalTime = 1000 / 120;
    let runners: any[] = [];
  
    onMount(() => {
      // Initialize runners
      runners = Array.from({ length: runnerCount }, () => {
        return {
          x: Math.random() * 100,          // position in vw
          y: Math.random() * 100,          // position in vh
          vx: (Math.random() - 0.5) * .10, // velocity in x
          vy: (Math.random() - 0.5) * .10, // velocity in y
        };
      });
  
      // Update motion every 50ms (change as desired)
      const interval = setInterval(() => {
        runners.forEach(r => {
          r.x += r.vx;
          r.y += r.vy;
  
          // Bounce horizontally
          if (r.x < 0) {
            r.x = 0;
            r.vx = -r.vx;
          } else if (r.x > 100) {
            r.x = 100;
            r.vx = -r.vx;
          }
  
          // Bounce vertically
          if (r.y < 0) {
            r.y = 0;
            r.vy = -r.vy;
          } else if (r.y > 100) {
            r.y = 100;
            r.vy = -r.vy;
          }
        });
        // Svelte won't see changes to array contents unless we assign
        // runners = runners. But to avoid re-render thrashing, you might
        // leave it out or only update occasionally.
        runners = [...runners];
      }, intervalTime);
  
      return () => {
        // Cleanup
        clearInterval(interval);
      };
    });
  </script>
  
  <!-- 
    - `pointer-events-none` so these floating dots don’t intercept clicks.
    - `-z-10` pushes it behind everything else (assuming you’re using Tailwind).
    - You can also use `inset-0` to fill the screen absolutely.
  -->
  <div class="absolute inset-0 pointer-events-none z-1 overflow-hidden ">
    {#each runners as runner, i}
      <div
        class="absolute bg-green-900 rounded-full"
        style="
          width: 0.4rem; 
          height: 0.4rem;
          left: {runner.x}vw;
          top: {runner.y}vh;
        "
      ></div>
    {/each}
  </div>
  