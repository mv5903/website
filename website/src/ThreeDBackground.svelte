<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';

  interface ShapeUserData {
    rotationSpeed: {
      x: number;
      y: number;
    };
    floatSpeed: number;
    floatAmplitude: number;
    phase: number;
    originalScale: number;
  }

  interface ExtendedMesh extends THREE.Mesh {
    userData: ShapeUserData;
  }

  let canvasContainer: HTMLDivElement;
  let animationId: number | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let shapes: ExtendedMesh[] = [];
  let pointLight1: THREE.PointLight | null = null;
  let pointLight2: THREE.PointLight | null = null;
  
  const mouse: THREE.Vector2 = new THREE.Vector2();
  let mouseX: number = 0;
  let mouseY: number = 0;

  onMount(() => {
    if (!canvasContainer) return;

    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 1, 100);
    
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    
    renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasContainer.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    pointLight1 = new THREE.PointLight(0x00ff88, 1, 100);
    pointLight1.position.set(20, 20, 20);
    scene.add(pointLight1);
    
    pointLight2 = new THREE.PointLight(0xff0088, 1, 100);
    pointLight2.position.set(-20, -20, -20);
    scene.add(pointLight2);
    
    // Create geometric shapes
    const shapeCount: number = 40;
    const geometries: THREE.BufferGeometry[] = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
      new THREE.TetrahedronGeometry(1, 0),
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.DodecahedronGeometry(1, 0)
    ];
    
    for (let i = 0; i < shapeCount; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.7, 0.5),
        emissive: new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.7, 0.2),
        
        emissiveIntensity: 0.5,
        shininess: 200,
        transparent: true,
        opacity: 0.15,
        wireframe: Math.random() > 0.7,
      });
      
      const mesh = new THREE.Mesh(geometry, material) as unknown as ExtendedMesh;
      
      // Random position
      mesh.position.x = (Math.random() - 0.5) * 50;
      mesh.position.y = (Math.random() - 0.5) * 50;
      mesh.position.z = (Math.random() - 0.5) * 50;
      
      // Random rotation
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      
      // Random scale
      const scale = Math.random() * 1.5 + 0.5;
      mesh.scale.set(scale, scale, scale);
      
      // Store additional properties for animation
      mesh.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01
        },
        floatSpeed: Math.random() * 0.5 + 0.5,
        floatAmplitude: Math.random() * 2 + 1,
        phase: Math.random() * Math.PI * 2,
        originalScale: scale
      };
      
      shapes.push(mesh);
      scene.add(mesh);
    }
    
    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    
    const handleMouseMove = (event: MouseEvent): void => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      mouseX = event.clientX - window.innerWidth / 2;
      mouseY = event.clientY - window.innerHeight / 2;
    };
    
    // Resize handler
    const handleResize = (): void => {
      if (!camera || !renderer) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const clock = new THREE.Clock();
    
    function animate(): void {
      if (!renderer || !scene || !camera || !pointLight1 || !pointLight2) return;
      
      animationId = requestAnimationFrame(animate);
      
      const time = clock.getElapsedTime();
      
      // Animate shapes
      shapes.forEach((shape, index) => {
        // Rotation
        shape.rotation.x += shape.userData.rotationSpeed.x;
        shape.rotation.y += shape.userData.rotationSpeed.y;
        
        // Floating motion
        const floatY = Math.sin(time * shape.userData.floatSpeed + shape.userData.phase) * shape.userData.floatAmplitude;
        shape.position.y += floatY * 0.01;
        
        // Subtle drift
        shape.position.x += Math.sin(time * 0.1 + index) * 0.01;
        shape.position.z += Math.cos(time * 0.1 + index) * 0.01;
        
        // Boundary check and wrap around
        const boundary = 30;
        if (shape.position.x > boundary) shape.position.x = -boundary;
        if (shape.position.x < -boundary) shape.position.x = boundary;
        if (shape.position.y > boundary) shape.position.y = -boundary;
        if (shape.position.y < -boundary) shape.position.y = boundary;
        if (shape.position.z > boundary) shape.position.z = -boundary;
        if (shape.position.z < -boundary) shape.position.z = boundary;
      });
      
      // Camera follow mouse slightly
      camera.position.x += (mouseX * 0.005 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.005 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      
      // Highlight shapes near mouse
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(shapes);
      
      shapes.forEach(shape => {
        const material = shape.material as THREE.MeshPhongMaterial;
        material.emissiveIntensity = 0.3;
        const targetScale = shape.userData.originalScale;
        shape.scale.x += (targetScale - shape.scale.x) * 0.1;
        shape.scale.y += (targetScale - shape.scale.y) * 0.1;
        shape.scale.z += (targetScale - shape.scale.z) * 0.1;
      });
      
      if (intersects.length > 0) {
        const closestShapes = intersects.slice(0, 3);
        closestShapes.forEach(intersect => {
          const mesh = intersect.object as ExtendedMesh;
          const material = mesh.material as THREE.MeshPhongMaterial;
          material.emissiveIntensity = 0.8;
          const targetScale = mesh.userData.originalScale * 1.5;
          mesh.scale.x += (targetScale - mesh.scale.x) * 0.1;
          mesh.scale.y += (targetScale - mesh.scale.y) * 0.1;
          mesh.scale.z += (targetScale - mesh.scale.z) * 0.1;
        });
      }
      
      // Animate lights
      pointLight1.position.x = Math.sin(time * 0.7) * 30;
      pointLight1.position.y = Math.cos(time * 0.5) * 40;
      
      pointLight2.position.x = Math.cos(time * 0.3) * 30;
      pointLight2.position.y = Math.sin(time * 0.5) * 40;
      
      renderer.render(scene, camera);
    }
    
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  });

  onDestroy(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    
    // Clean up Three.js resources
    if (renderer) {
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }
    
    // Dispose of geometries and materials
    shapes.forEach(shape => {
      if (shape.geometry) shape.geometry.dispose();
      if (shape.material) {
        if (Array.isArray(shape.material)) {
          shape.material.forEach(mat => mat.dispose());
        } else {
          shape.material.dispose();
        }
      }
    });
    
    // Clear arrays and references
    shapes = [];
    renderer = null;
    scene = null;
    camera = null;
    pointLight1 = null;
    pointLight2 = null;
  });
</script>

<div class="canvas-container" bind:this={canvasContainer}></div>

<style>
  .canvas-container {
    position: fixed;
    background-size: cover;
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  
  /* Global styles for when this component is used */
  :global(body) {
    margin: 0;
    padding: 0;
    background: transparent;
  }
</style>