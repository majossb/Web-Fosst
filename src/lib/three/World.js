/**
 * World.js — Main Three.js scene orchestrator
 * 
 * Persistent scene and renderer. The scroll conductor drives all state.
 * Single entry point: init, update loop, resize, dispose.
 * Pauses when tab is hidden or world scrolls out of view.
 */
import * as THREE from 'three';
import { initScrollState, updateSmooth, getScrollState, lerp, sm } from './scrollState.js';
import { CHAPTERS, getCurrentChapter, getChapterProgress } from './chapters.js';

export class World {
  constructor(canvas, scrollContainer) {
    this.canvas = canvas;
    this.scrollContainer = scrollContainer;
    this.isRunning = false;
    this.isDisposed = false;
    this.clock = new THREE.Clock();
    this.mouse = { x: 0, y: 0 };
    this.debugMode = false;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Detect device capability
    this.isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    this.isLowEnd = this.isMobile || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  }

  init() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: !this.isLowEnd,
      alpha: true,
      powerPreference: this.isLowEnd ? 'low-power' : 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    const dpr = this.isLowEnd 
      ? Math.min(window.devicePixelRatio, 1.25) 
      : Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Scene - Completely transparent
    this.scene = new THREE.Scene();

    // Camera
    const fov = this.isMobile ? 65 : 55;
    this.camera = new THREE.PerspectiveCamera(fov, w / h, 0.5, 100);
    this.camera.position.set(0, 18, 30);
    this.camera.lookAt(0, 2, 0);

    // Subtle lighting rig
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(this.ambientLight);

    // Initialize scroll state
    initScrollState(this.scrollContainer);

    // Event listeners
    this._onResize = () => this.resize();
    this._onMouseMove = (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    this._onVisibilityChange = () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    };
    this._onKeyDown = (e) => {
      if (e.key === 'd' || e.key === 'D') {
        this.debugMode = !this.debugMode;
        const el = document.getElementById('world-debug');
        if (el) el.style.display = this.debugMode ? 'block' : 'none';
      }
    };

    window.addEventListener('resize', this._onResize);
    window.addEventListener('mousemove', this._onMouseMove, { passive: true });
    document.addEventListener('visibilitychange', this._onVisibilityChange);
    window.addEventListener('keydown', this._onKeyDown);

    // Fade in canvas
    this.canvas.style.opacity = '0';
    this.canvas.style.transition = 'opacity 1s ease';
    requestAnimationFrame(() => { this.canvas.style.opacity = '1'; });

    // Start the loop
    this.isRunning = true;
    this._animate();
  }

  _animate() {
    if (!this.isRunning || this.isDisposed) return;
    requestAnimationFrame(() => this._animate());

    const dt = Math.min(this.clock.getDelta(), 0.1); // Cap delta to avoid huge jumps
    updateSmooth();
    const { uSmooth, isWorldVisible } = getScrollState();

    // Pause rendering when world is off-screen
    if (!isWorldVisible) return;

    this._updateScene(uSmooth, dt);
    this.renderer.render(this.scene, this.camera);
  }

  _updateScene(u, dt) {
    const chapterIdx = getCurrentChapter(u);
    const ch = CHAPTERS[chapterIdx];
    const nextCh = CHAPTERS[Math.min(chapterIdx + 1, CHAPTERS.length - 1)];
    const progress = getChapterProgress(chapterIdx, u);

    // Camera interpolation
    this.camera.position.set(
      lerp(ch.cameraStart.x, ch.cameraEnd.x, progress),
      lerp(ch.cameraStart.y, ch.cameraEnd.y, progress),
      lerp(ch.cameraStart.z, ch.cameraEnd.z, progress)
    );

    // Parallax with pointer (max ±0.6)
    const parallaxStrength = 0.6;
    this.camera.position.x += this.mouse.x * parallaxStrength;

    // LookAt interpolation
    const lookX = lerp(ch.lookAtStart.x, ch.lookAtEnd.x, progress);
    const lookY = lerp(ch.lookAtStart.y, ch.lookAtEnd.y, progress);
    const lookZ = lerp(ch.lookAtStart.z, ch.lookAtEnd.z, progress);
    this.camera.lookAt(lookX, lookY, lookZ);

    // Debug overlay
    if (this.debugMode) {
      const debugEl = document.getElementById('world-debug');
      if (debugEl) {
        debugEl.textContent = `u: ${u.toFixed(3)} | ch: ${chapterIdx} | fps: ${(1 / dt).toFixed(0)}`;
      }
    }
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  pause() {
    this.isRunning = false;
    this.clock.stop();
  }

  resume() {
    if (this.isDisposed) return;
    if (!this.isRunning) {
      this.isRunning = true;
      this.clock.start();
      this._animate();
    }
  }

  dispose() {
    this.isDisposed = true;
    this.isRunning = false;

    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('visibilitychange', this._onVisibilityChange);
    window.removeEventListener('keydown', this._onKeyDown);

    if (this.ambientLight) this.ambientLight.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
