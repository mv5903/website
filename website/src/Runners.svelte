<script lang="ts">
  import { onMount } from 'svelte';

  // Number of runners and update interval
  const runnerCount = 0;
  const intervalTime = 1000 / 120;
  let runners: any[] = [];

  const runnerPixelRadius = 3.2;

  // A helper clamp function.
  function clamp(val: number, min: number, max: number) {
    return Math.max(min, Math.min(max, val));
  }

  onMount(() => {
    // Initialize runners with random positions (in vw/vh) and velocities.
    runners = Array.from({ length: runnerCount }, () => {
      return {
        x: Math.random() * 100,           // position in vw
        y: Math.random() * 100,           // position in vh
        vx: (Math.random() - 0.5) * 1,   // velocity in vw per tick
        vy: (Math.random() - 0.5) * 1,   // velocity in vh per tick
      };
    });

    const interval = setInterval(() => {
      runners.forEach(r => {
        // Update runner’s position (in vw/vh)
        r.x += r.vx;
        r.y += r.vy;

        // Bounce off viewport edges (using vw/vh)
        if (r.x < 0) {
          r.x = 0;
          r.vx = -r.vx;
        } else if (r.x > 100) {
          r.x = 100;
          r.vx = -r.vx;
        }
        if (r.y < 0) {
          r.y = 0;
          r.vy = -r.vy;
        } else if (r.y > 100) {
          r.y = 100;
          r.vy = -r.vy;
        }

        // Convert runner's position from vw/vh to pixels
        let runnerPxX = (r.x * window.innerWidth) / 100;
        let runnerPxY = (r.y * window.innerHeight) / 100;

        // Get all visible elements on the page except the runner container
        const obstacles = Array.from(document.querySelectorAll('body *'))
          .filter(el => !el.closest('.runner-container'));

        obstacles.forEach(ob => {
          const rect = ob.getBoundingClientRect();
          // Skip elements that have no size.
          if (rect.width === 0 || rect.height === 0) return;

          const closestX = clamp(runnerPxX, rect.left, rect.right);
          const closestY = clamp(runnerPxY, rect.top, rect.bottom);
          const dx = runnerPxX - closestX;
          const dy = runnerPxY - closestY;
          const distanceSq = dx * dx + dy * dy;
          const radiusSq = runnerPixelRadius * runnerPixelRadius;

          if (distanceSq < radiusSq) {
            // Collision detected.
            if (dx === 0 && dy === 0) {
              // Rare: the runner’s center is exactly inside the rectangle.
              r.vx = -r.vx;
              r.vy = -r.vy;
            } else if (Math.abs(dx) > Math.abs(dy)) {
              // Horizontal collision: bounce off left/right side.
              r.vx = -r.vx;
              // Push the runner outside the obstacle horizontally.
              if (runnerPxX < (rect.left + rect.right) / 2) {
                runnerPxX = rect.left - runnerPixelRadius;
              } else {
                runnerPxX = rect.right + runnerPixelRadius;
              }
              // Convert the adjusted pixel position back to vw.
              r.x = (runnerPxX * 100) / window.innerWidth;
            } else {
              // Vertical collision: bounce off top/bottom side.
              r.vy = -r.vy;
              if (runnerPxY < (rect.top + rect.bottom) / 2) {
                runnerPxY = rect.top - runnerPixelRadius;
              } else {
                runnerPxY = rect.bottom + runnerPixelRadius;
              }
              r.y = (runnerPxY * 100) / window.innerHeight;
            }
          }
        });
      });
      // Trigger Svelte reactivity.
      runners = [...runners];
    }, intervalTime);

    return () => {
      clearInterval(interval);
    };
  });
</script>

<div class="runner-container absolute inset-0 pointer-events-none z-10 overflow-hidden">
  {#each runners as runner}
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
