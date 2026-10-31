import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Procedural Fallback Texture Generator for Book Covers & Spines
 */
function createFallbackTexture(type, id, title, colorHex = '#FFC800', badge = '') {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (type === 'spine') {
    canvas.width = 128;
    canvas.height = 1024;
    ctx.fillStyle = '#070D1F';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = colorHex;
    ctx.fillRect(0, 0, 6, canvas.height);
    ctx.font = 'bold 36px monospace';
    ctx.fillStyle = colorHex;
    ctx.textAlign = 'center';
    ctx.fillText(`0${id}`, 64, 80);
    ctx.save();
    ctx.translate(64, 512);
    ctx.rotate(-Math.PI / 2);
    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(title.length > 25 ? title.slice(0, 22) + '...' : title, 0, 8);
    ctx.restore();
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = colorHex;
    ctx.fillText('FOSST', 64, 960);
  } else if (type === 'pages') {
    canvas.width = 256;
    canvas.height = 256;
    ctx.fillStyle = '#E8E4DA';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#D4CFBE';
    for (let y = 4; y < canvas.height; y += 8) {
      ctx.fillRect(0, y, canvas.width, 1.5);
    }
  } else if (type === 'back') {
    canvas.width = 512;
    canvas.height = 768;
    ctx.fillStyle = '#060A16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    ctx.fillStyle = colorHex;
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FOSST CONSULTORÍA', 256, 120);
    ctx.font = '16px monospace';
    ctx.fillStyle = '#64748B';
    ctx.fillText('SISTEMA DE GESTIÓN INTEGRAL', 256, 160);
    ctx.fillStyle = '#E2E8F0';
    for (let x = 120; x < 392; x += Math.random() * 8 + 4) {
      ctx.fillRect(x, 620, Math.random() * 3 + 1, 50);
    }
    ctx.font = '12px monospace';
    ctx.fillText(`978-958-FOSST-0${id}`, 256, 690);
  } else {
    canvas.width = 512;
    canvas.height = 768;
    ctx.fillStyle = '#070D1F';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 4;
    ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('FOSST', 50, 70);
    ctx.font = 'bold 96px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.textAlign = 'right';
    ctx.fillText(`0${id}`, 460, 160);
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = colorHex;
    ctx.textAlign = 'left';
    ctx.fillText(badge || 'NORMATIVA COLOMBIANA', 50, 220);
    ctx.font = 'bold 32px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    const words = title.split(' ');
    let line = '';
    let y = 300;
    for (const w of words) {
      if ((line + ' ' + w).length > 18) {
        ctx.fillText(line.trim(), 50, y);
        line = w;
        y += 40;
      } else {
        line += ' ' + w;
      }
    }
    if (line) ctx.fillText(line.trim(), 50, y);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export class CharacterGuide {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = options;
    this.services = options.services || [];
    this.onActiveBookChange = options.onActiveBookChange || (() => {});
    this.onSectionChange = options.onSectionChange || (() => {});

    // Three.js Core
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.cameraBasePos = new THREE.Vector3(0, 0, 7.5);
    this.cameraTargetPos = new THREE.Vector3(0, 0, 7.5);
    this.camera.position.copy(this.cameraBasePos);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Groups
    this.characterGroup = new THREE.Group();
    this.scene.add(this.characterGroup);

    this.booksGroup = new THREE.Group();
    this.scene.add(this.booksGroup);

    // Book models
    this.books = [];
    this.activeBookIndex = 0;
    this.carouselProgress = 0;
    this.inPortfolioSection = false;

    // Active Narrative Section: 'hero' | 'portafolio' | 'diagnostico' | 'contacto'
    this.activeSection = 'hero';
    this.isHoveringService = false;
    this.hoveredServiceTitle = '';

    // Mouse tracking & tilt
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.clock = new THREE.Clock();

    // Target transforms for character
    this.targetPos = new THREE.Vector3(2.5, -0.95, 0.85);
    this.targetRot = new THREE.Euler(0, -0.38, 0);
    this.targetScale = new THREE.Vector3(1.35, 1.35, 1.35);

    // Bone management (SmartRigArmature: Bone_000 to Bone_011)
    this.bones = {};
    this.restRotations = {};
    this.currentBoneOffsets = {};
    this.targetBoneOffsets = {};

    // Props attached to character hands
    this.scannerProp = null;
    this.checklistProp = null;
    this.stylusProp = null;

    // Bindings
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.renderLoop = this.renderLoop.bind(this);

    this.init();
  }

  async init() {
    this.setupLighting();
    this.setupBooks();
    await this.loadCharacter();
    this.setupProps();
    this.setupScrollTrigger();
    this.setupSectionTracker();
    this.setupServiceHoverListeners();

    window.addEventListener('resize', this.onWindowResize, { passive: true });
    window.addEventListener('mousemove', this.onMouseMove, { passive: true });

    this.clock.start();
    this.renderLoop();
  }

  setupLighting() {
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.5);
    this.scene.add(ambientLight);

    // Key Light (Warm Gold / Industrial Yellow)
    this.keyLight = new THREE.DirectionalLight(0xfff5ea, 2.4);
    this.keyLight.position.set(4, 5, 6);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.keyLight.shadow.bias = -0.0005;
    this.scene.add(this.keyLight);

    // Tech Rim Light (Cyan highlight on armature silhouettes)
    this.rimLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
    this.rimLight.position.set(-6, 3, -2);
    this.scene.add(this.rimLight);

    // Warm Fill Light from below
    this.warmFill = new THREE.PointLight(0xffc800, 1.8, 15, 1.5);
    this.warmFill.position.set(0, -3, 3);
    this.scene.add(this.warmFill);

    // Focus Spot on Props / Interactive area
    this.propLight = new THREE.PointLight(0x38bdf8, 0, 8, 2);
    this.propLight.position.set(-1.8, 0, 2);
    this.scene.add(this.propLight);
  }

  setupBooks() {
    const textureLoader = new THREE.TextureLoader();
    const pagesTexture = createFallbackTexture('pages', 0, 'PAGINAS');

    const pagesMaterial = new THREE.MeshStandardMaterial({
      map: pagesTexture,
      roughness: 0.85,
      metalness: 0.05,
      color: 0xf3efe6
    });

    const servicesData = this.services.length > 0 ? this.services : [
      { id: 1, nombre: 'Diseño e implementación del SG-SST', badge: 'RES. 0312 / 2019', color: '#FFC800' },
      { id: 2, nombre: 'Gestión del riesgo psicosocial', badge: 'RES. 2764 / 2022', color: '#38BDF8' },
      { id: 3, nombre: 'Consultoría en Talento Humano y SST', badge: 'CST / LEY 2466', color: '#FFC800' },
      { id: 4, nombre: 'Asesoría jurídica laboral preventiva', badge: 'PREVENTIVO / DEBIDO PROCESO', color: '#38BDF8' },
      { id: 5, nombre: 'Gestión ambiental y sostenibilidad', badge: 'PGIRS / RESPEL', color: '#10B981' },
      { id: 6, nombre: 'Sistemas de vigilancia epidemiológica', badge: 'ERGONOMÍA & DME', color: '#38BDF8' },
      { id: 7, nombre: 'Planes Estratégicos de Seguridad Vial', badge: 'RES. 40595 / ANSV', color: '#FFC800' },
      { id: 8, nombre: 'Auditorías internas y de cumplimiento', badge: 'ISO 45001 & 9001', color: '#38BDF8' },
      { id: 9, nombre: 'Formación, capacitación y brigadas', badge: 'BRIGADA & PRIMEROS AUX.', color: '#F97316' }
    ];

    const bookGeometry = new THREE.BoxGeometry(1.7, 2.35, 0.28);

    servicesData.forEach((s, i) => {
      const id = s.id || i + 1;
      const colorHex = s.color || (i % 2 === 0 ? '#FFC800' : '#38BDF8');

      const coverUrl = `/assets/images/portada-${id}.jpg`;
      const spineUrl = `/assets/images/lomo-${id}.jpg`;

      const coverTexture = textureLoader.load(
        coverUrl,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 8;
        },
        undefined,
        () => {
          book.materials[4].map = createFallbackTexture('front', id, s.nombre, colorHex, s.badge);
          book.materials[4].needsUpdate = true;
        }
      );

      const spineTexture = textureLoader.load(
        spineUrl,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 8;
        },
        undefined,
        () => {
          book.materials[1].map = createFallbackTexture('spine', id, s.nombre, colorHex, s.badge);
          book.materials[1].needsUpdate = true;
        }
      );

      const backTexture = createFallbackTexture('back', id, s.nombre, colorHex, s.badge);

      const materials = [
        pagesMaterial,
        new THREE.MeshStandardMaterial({ map: spineTexture, roughness: 0.35, metalness: 0.15 }),
        pagesMaterial,
        pagesMaterial,
        new THREE.MeshStandardMaterial({ map: coverTexture, roughness: 0.3, metalness: 0.15 }),
        new THREE.MeshStandardMaterial({ map: backTexture, roughness: 0.4, metalness: 0.1 })
      ];

      const mesh = new THREE.Mesh(bookGeometry, materials);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const bookContainer = new THREE.Group();
      bookContainer.add(mesh);
      bookContainer.position.set(0, -20, 0);
      bookContainer.scale.set(0.001, 0.001, 0.001);

      this.booksGroup.add(bookContainer);

      const book = {
        id,
        service: s,
        container: bookContainer,
        mesh,
        materials,
        tiltX: 0,
        tiltY: 0
      };
      this.books.push(book);
    });
  }

  async loadCharacter() {
    const loader = new GLTFLoader();

    try {
      const gltf = await new Promise((resolve, reject) => {
        loader.load(
          '/assets/3d/robotpj.glb',
          resolve,
          undefined,
          (err) => {
            // Fallback try personaje.glb
            loader.load('/assets/3d/personaje.glb', resolve, undefined, reject);
          }
        );
      });

      const model = gltf.scene;

      // Extract all SmartRigArmature bones
      model.traverse((child) => {
        if (child.isBone) {
          this.bones[child.name] = child;
          this.restRotations[child.name] = child.quaternion.clone();
          this.currentBoneOffsets[child.name] = new THREE.Euler(0, 0, 0);
          this.targetBoneOffsets[child.name] = new THREE.Euler(0, 0, 0);
        }
        if (child.isMesh || child.isSkinnedMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.roughness = THREE.MathUtils.clamp(child.material.roughness, 0.25, 0.55);
            child.material.metalness = THREE.MathUtils.clamp(child.material.metalness, 0.15, 0.45);
          }
        }
      });

      // Character scale & pivot: Model height is ~1.7m, scale to ~2.3m
      const desiredHeight = 2.3;
      model.scale.setScalar(desiredHeight / 1.7);
      // Place feet on root ground
      model.position.set(0, -1.15, 0);

      this.characterPivot = new THREE.Group();
      this.characterPivot.add(model);
      this.characterGroup.add(this.characterPivot);
      this.characterMesh = model;

      // Initial placement (Global Sticky Guide: bottom-right corner)
      this.characterGroup.position.copy(this.targetPos);
      this.characterGroup.rotation.copy(this.targetRot);
      this.characterGroup.scale.copy(this.targetScale);

    } catch (err) {
      console.error('Error loading robotpj.glb character:', err);
    }
  }

  setupProps() {
    const rightHand = this.bones['Bone_004'];
    const leftHand = this.bones['Bone_007'];

    // 1. Holographic Scanner / Magnifier (attached to Right Hand Bone_004)
    const scannerGroup = new THREE.Group();

    // Metallic grip
    const gripGeo = new THREE.CylinderGeometry(0.025, 0.03, 0.22, 16);
    const gripMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.8
    });
    const grip = new THREE.Mesh(gripGeo, gripMat);
    grip.rotation.x = Math.PI / 2;
    scannerGroup.add(grip);

    // Glowing cyan frame / ring
    const ringGeo = new THREE.TorusGeometry(0.12, 0.022, 16, 32);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.9
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(0, 0.16, 0.04);
    scannerGroup.add(ring);

    // Holographic lens with translucent glow
    const lensGeo = new THREE.CircleGeometry(0.1, 32);
    const lensMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.set(0, 0.16, 0.04);
    scannerGroup.add(lens);

    // Holographic laser beam cone
    const beamGeo = new THREE.ConeGeometry(0.3, 1.5, 24, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(0, 0.16, 0.8);
    beam.rotation.x = -Math.PI / 2;
    scannerGroup.add(beam);

    scannerGroup.scale.set(0.0001, 0.0001, 0.0001);
    if (rightHand) {
      rightHand.add(scannerGroup);
    }
    this.scannerProp = scannerGroup;

    // 2. Checklist / Clipboard Tablet (attached to Left Hand Bone_007)
    const checklistGroup = new THREE.Group();

    // Clipboard body
    const boardGeo = new THREE.BoxGeometry(0.36, 0.5, 0.02);
    const boardMat = new THREE.MeshStandardMaterial({
      color: 0x090d1a,
      roughness: 0.3,
      metalness: 0.5
    });
    const board = new THREE.Mesh(boardGeo, boardMat);
    checklistGroup.add(board);

    // Screen
    const screenGeo = new THREE.PlaneGeometry(0.31, 0.42);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x030712,
      emissive: 0x1e293b,
      emissiveIntensity: 0.4,
      roughness: 0.1
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = 0.012;
    checklistGroup.add(screen);

    // Glowing checklist items (green & yellow check lines)
    const checkColors = [0x10b981, 0x10b981, 0x38bdf8, 0xffc800];
    checkColors.forEach((color, idx) => {
      const lineGeo = new THREE.PlaneGeometry(0.22, 0.02);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0x64748b });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.set(0.03, 0.14 - idx * 0.09, 0.015);
      checklistGroup.add(line);

      const dotGeo = new THREE.CircleGeometry(0.018, 16);
      const dotMat = new THREE.MeshBasicMaterial({ color });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(-0.11, 0.14 - idx * 0.09, 0.016);
      checklistGroup.add(dot);
    });

    checklistGroup.scale.set(0.0001, 0.0001, 0.0001);
    checklistGroup.position.set(0, 0.05, 0);
    checklistGroup.rotation.set(0.4, -0.2, 0);
    if (leftHand) {
      leftHand.add(checklistGroup);
    }
    this.checklistProp = checklistGroup;

    // 3. Digital Stylus / Pointer (attached to Right Hand Bone_004)
    const stylusGroup = new THREE.Group();
    const stylusGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.25, 12);
    const stylusMat = new THREE.MeshStandardMaterial({
      color: 0xffc800,
      emissive: 0xffc800,
      emissiveIntensity: 0.5,
      metalness: 0.8
    });
    const stylus = new THREE.Mesh(stylusGeo, stylusMat);
    stylus.rotation.x = Math.PI / 2;
    stylusGroup.add(stylus);
    stylusGroup.scale.set(0.0001, 0.0001, 0.0001);
    if (rightHand) {
      rightHand.add(stylusGroup);
    }
    this.stylusProp = stylusGroup;
  }

  setupScrollTrigger() {
    const portfolioEl = document.getElementById('portafolio');
    if (!portfolioEl) return;

    this.scrollTrigger = ScrollTrigger.create({
      trigger: '#portafolio',
      pin: true,
      scrub: 1,
      start: 'top top',
      end: '+=300%',
      onEnter: () => {
        this.inPortfolioSection = true;
        this.setNarrativeSection('portafolio');
      },
      onLeave: () => {
        this.inPortfolioSection = false;
        this.setNarrativeSection('diagnostico');
      },
      onEnterBack: () => {
        this.inPortfolioSection = true;
        this.setNarrativeSection('portafolio');
      },
      onLeaveBack: () => {
        this.inPortfolioSection = false;
        this.setNarrativeSection('hero');
      },
      onUpdate: (self) => {
        this.carouselProgress = self.progress;
        this.updateBooksCarousel(self.progress);
      }
    });
  }

  setupSectionTracker() {
    const sectionConfigs = [
      { id: 'hero', narrative: 'hero', msg: '¡Hola! Te doy la bienvenida a FOSST. Soy tu guía interactivo 3D para transformar el riesgo en orden.' },
      { id: 'scroll-world', narrative: 'hero', msg: 'Primero, ver el riesgo tal como es. Diagnóstico de estándares mínimos (Res. 0312).' },
      { id: 'portafolio', narrative: 'portafolio', msg: 'Explora nuestros 9 servicios especializados representados como guías técnicas 3D interactuables.' },
      { id: 'servicios', narrative: 'portafolio', msg: 'Pasa el cursor sobre cada servicio técnico para inspeccionar su alcance y normativa aplicable.' },
      { id: 'diagnostico-cta', narrative: 'diagnostico', msg: 'Evaluemos tus riesgos laborales: revisemos estándares mínimos con nuestra tabla de verificación.' },
      { id: 'metodologia', narrative: 'diagnostico', msg: 'Método probado en 4 fases: Diagnosticar, Diseñar, Implementar y Auditar continuamente.' },
      { id: 'beneficios', narrative: 'diagnostico', msg: 'Ahorro de hasta 40% en costos de no cumplimiento y blindaje legal preventivo.' },
      { id: 'faq', narrative: 'contacto', msg: '¿Tienes dudas sobre la normatividad laboral de tu empresa? Conversemos de inmediato.' },
      { id: 'final-cta-section', narrative: 'contacto', msg: 'Protege a tu equipo hoy mismo. Haz tu diagnóstico gratuito o contáctanos por WhatsApp.' }
    ];

    window.addEventListener('scroll', () => {
      if (this.inPortfolioSection) return;

      const vh = window.innerHeight;
      for (const item of sectionConfigs) {
        const el = document.getElementById(item.id) || document.querySelector(`.${item.id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= vh * 0.55 && rect.bottom >= vh * 0.15) {
            this.setNarrativeSection(item.narrative, item.msg);
            break;
          }
        }
      }
    }, { passive: true });
  }

  setupServiceHoverListeners() {
    // Listen for hover on service cards across the page
    const cards = document.querySelectorAll('a[href*="/servicios/"], [data-service-card], .service-card');
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        this.isHoveringService = true;
        const titleEl = card.querySelector('h3, h4, .service-title');
        this.hoveredServiceTitle = titleEl ? titleEl.textContent.trim() : 'Servicio Especializado';

        // Camera zoom in & focus on scanner
        this.cameraTargetPos.set(-0.2, 0.05, 6.2);

        // Update dialog
        this.onSectionChange(
          'service-inspect',
          `Inspeccionando: ${this.hoveredServiceTitle}. Cumplimiento normativo y prevención especializada.`
        );
      });

      card.addEventListener('mouseleave', () => {
        this.isHoveringService = false;
        if (!this.inPortfolioSection) {
          this.cameraTargetPos.copy(this.cameraBasePos);
        } else {
          this.cameraTargetPos.set(-0.35, 0.05, 6.4);
        }
      });
    });
  }

  setNarrativeSection(sectionKey, message) {
    if (this.activeSection === sectionKey && !message) return;
    this.activeSection = sectionKey;

    if (message) {
      this.onSectionChange(sectionKey, message);
    }

    // Configure Section Transforms & Camera Framing
    if (sectionKey === 'hero') {
      this.targetPos.set(2.5, -0.95, 0.85);
      this.targetRot.set(0, -0.38, 0);
      this.targetScale.set(1.35, 1.35, 1.35);
      this.cameraTargetPos.copy(this.cameraBasePos);
    } else if (sectionKey === 'portafolio') {
      this.targetPos.set(-2.55, -0.65, 1.3);
      this.targetRot.set(0, 0.48, 0);
      this.targetScale.set(1.4, 1.4, 1.4);
      this.cameraTargetPos.set(-0.35, 0.05, 6.4); // Zoom in on hands and books
    } else if (sectionKey === 'diagnostico') {
      this.targetPos.set(2.4, -0.85, 0.9);
      this.targetRot.set(0, -0.32, 0);
      this.targetScale.set(1.35, 1.35, 1.35);
      this.cameraTargetPos.set(0.1, 0, 7.2);
    } else if (sectionKey === 'contacto') {
      this.targetPos.set(2.3, -0.9, 1.0);
      this.targetRot.set(0, -0.45, 0);
      this.targetScale.set(1.4, 1.4, 1.4);
      this.cameraTargetPos.copy(this.cameraBasePos);
    }
  }

  updateBooksCarousel(progress) {
    if (!this.books || this.books.length === 0) return;

    const total = this.books.length;
    const continuousIndex = progress * (total - 1);
    const activeIndex = Math.min(total - 1, Math.max(0, Math.round(continuousIndex)));

    if (activeIndex !== this.activeBookIndex) {
      this.activeBookIndex = activeIndex;
      this.onActiveBookChange(activeIndex, this.books[activeIndex].service);
    }

    const stageCenterX = 0.95;
    const stageCenterY = -0.05;

    this.books.forEach((book, i) => {
      const delta = i - continuousIndex;
      const absDelta = Math.abs(delta);

      let targetX, targetY, targetZ, targetRotY, targetRotX, targetRotZ, targetScale;

      if (absDelta < 0.05) {
        targetX = stageCenterX;
        targetY = stageCenterY;
        targetZ = 1.35;
        targetRotY = -0.22 + (book.tiltY || 0);
        targetRotX = 0.04 + (book.tiltX || 0);
        targetRotZ = 0;
        targetScale = 1.16;
      } else if (delta > 0) {
        targetX = stageCenterX + delta * 0.72;
        targetY = stageCenterY - delta * 0.06;
        targetZ = 1.35 - delta * 0.85;
        targetRotY = -0.22 - delta * 0.18;
        targetRotX = 0.04;
        targetRotZ = -delta * 0.02;
        targetScale = Math.max(0.4, 1.16 * Math.pow(0.85, delta));
      } else {
        targetX = stageCenterX + delta * 0.78;
        targetY = stageCenterY + Math.abs(delta) * 0.05;
        targetZ = 1.35 + delta * 0.95;
        targetRotY = -0.22 - delta * 0.28;
        targetRotX = 0.04;
        targetRotZ = -delta * 0.02;
        targetScale = Math.max(0.4, 1.16 * Math.pow(0.83, absDelta));
      }

      book.container.position.x += (targetX - book.container.position.x) * 0.18;
      book.container.position.y += (targetY - book.container.position.y) * 0.18;
      book.container.position.z += (targetZ - book.container.position.z) * 0.18;

      book.container.rotation.x += (targetRotX - book.container.rotation.x) * 0.18;
      book.container.rotation.y += (targetRotY - book.container.rotation.y) * 0.18;
      book.container.rotation.z += (targetRotZ - book.container.rotation.z) * 0.18;

      book.container.scale.setScalar(
        book.container.scale.x + (targetScale - book.container.scale.x) * 0.18
      );
    });
  }

  onMouseMove(e) {
    this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

    if (this.inPortfolioSection && this.books[this.activeBookIndex]) {
      const activeBook = this.books[this.activeBookIndex];
      activeBook.tiltX = -this.mouse.targetY * 0.15;
      activeBook.tiltY = this.mouse.targetX * 0.2;
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  /**
   * Main Render & Smooth Lerp Animation Loop
   */
  renderLoop() {
    this.animationFrameId = requestAnimationFrame(this.renderLoop);

    const elapsedTime = this.clock.getElapsedTime();

    // Lerp mouse
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    // Smooth camera zoom/pan lerp
    this.camera.position.lerp(this.cameraTargetPos, 0.06);

    // Smooth lerp character transforms to target
    this.characterGroup.position.lerp(this.targetPos, 0.08);
    this.characterGroup.scale.lerp(this.targetScale, 0.08);

    // Idle breathing & floating harmonic motions
    const floatOffset = Math.sin(elapsedTime * 1.6) * 0.045;
    const breatheY = 1.0 + Math.sin(elapsedTime * 2.0) * 0.012;

    if (this.characterPivot) {
      this.characterPivot.position.y = floatOffset;
      this.characterPivot.scale.set(1, breatheY, 1);
    }

    // -------------------------------------------------------------
    // Calculate Procedural Bone Targets According to Narrative Pose
    // -------------------------------------------------------------
    this.computeBonePoseTargets(elapsedTime);

    // -------------------------------------------------------------
    // Apply Lerp to Bones (Bone_000 to Bone_011)
    // -------------------------------------------------------------
    const lerpSpeed = 0.085;
    for (const [name, target] of Object.entries(this.targetBoneOffsets)) {
      const current = this.currentBoneOffsets[name];
      if (current && this.bones[name]) {
        current.x += (target.x - current.x) * lerpSpeed;
        current.y += (target.y - current.y) * lerpSpeed;
        current.z += (target.z - current.z) * lerpSpeed;

        const offsetQuat = new THREE.Quaternion().setFromEuler(current);
        const restQuat = this.restRotations[name];
        if (restQuat) {
          this.bones[name].quaternion.copy(restQuat).multiply(offsetQuat);
        }
      }
    }

    // -------------------------------------------------------------
    // Props Visibility & Pulsing Animation
    // -------------------------------------------------------------
    this.updateProps(elapsedTime);

    // Hide books smoothly when outside portfolio section
    if (!this.inPortfolioSection) {
      this.books.forEach((b) => {
        b.container.scale.lerp(new THREE.Vector3(0.001, 0.001, 0.001), 0.1);
      });
    }

    this.renderer.render(this.scene, this.camera);
  }

  computeBonePoseTargets(t) {
    const mx = this.mouse.x;
    const my = this.mouse.y;

    // Reset base targets
    for (const name of Object.keys(this.targetBoneOffsets)) {
      this.targetBoneOffsets[name].set(0, 0, 0);
    }

    // Common Gaze / Mouse Follow offsets on upper bones (Spine, Neck, Head)
    const spinePitch = -my * 0.06;
    const spineYaw = mx * 0.08;
    const neckPitch = -my * 0.12;
    const neckYaw = mx * 0.18;
    const headPitch = -my * 0.22;
    const headYaw = mx * 0.32;

    if (this.activeSection === 'hero') {
      // ---------------------------------------------------------
      // SECCIÓN 1: HERO / INICIO (Postura de Saludo y Bienvenida)
      // ---------------------------------------------------------
      // Friendly waving arm (Right: Bone_006, 005, 004)
      const wave = Math.sin(t * 4.5) * 0.32;
      this.targetBoneOffsets['Bone_006']?.set(-0.45, -0.2, -1.05); // R Shoulder
      this.targetBoneOffsets['Bone_005']?.set(-0.65, 0.45, -0.2);  // R Elbow
      this.targetBoneOffsets['Bone_004']?.set(0, 0.1, wave);       // R Hand waving!

      // Left Arm relaxed at side with subtle breathing sway
      this.targetBoneOffsets['Bone_009']?.set(0.05, 0.1, 0.18);
      this.targetBoneOffsets['Bone_008']?.set(-0.25, 0, 0);

      // Spine & Torso upright with gentle breathing
      const breathe = Math.sin(t * 2.0) * 0.02;
      this.targetBoneOffsets['Bone_001']?.set(breathe + spinePitch, spineYaw, 0);
      this.targetBoneOffsets['Bone_003']?.set(breathe * 0.5, 0, 0);

      // Head & Neck welcoming gaze
      this.targetBoneOffsets['Bone_011']?.set(neckPitch, neckYaw, 0);
      this.targetBoneOffsets['Bone_010']?.set(headPitch - 0.04, headYaw, -0.06);

      // Character overall rotation facing camera
      this.characterGroup.rotation.y += (this.targetRot.y + mx * 0.2 - this.characterGroup.rotation.y) * 0.06;

    } else if (this.activeSection === 'portafolio') {
      // ---------------------------------------------------------
      // SECCIÓN 2: PORTAFOLIO (Exploración / Escáner Holográfico)
      // ---------------------------------------------------------
      // R Arm holding scanner / inspection device aimed at books
      const scanHover = Math.sin(t * 2.2) * 0.05;
      const scanAimX = this.isHoveringService ? -0.88 : -0.72;
      const scanAimY = this.isHoveringService ? -0.45 : -0.35;

      this.targetBoneOffsets['Bone_006']?.set(scanAimX, scanAimY, -0.48); // R Shoulder forward
      this.targetBoneOffsets['Bone_005']?.set(0.48, 0.22, scanHover);    // R Elbow holding device
      this.targetBoneOffsets['Bone_004']?.set(-0.15, -0.25, 0);          // R Hand gripping scanner

      // L Arm guiding / gesture towards services
      this.targetBoneOffsets['Bone_009']?.set(-0.35, 0.25, 0.38);
      this.targetBoneOffsets['Bone_008']?.set(-0.28, 0.1, 0);

      // Head looking intently at the active book or inspected card
      this.targetBoneOffsets['Bone_011']?.set(-0.06 + neckPitch * 0.5, 0.28 + neckYaw * 0.5, 0);
      this.targetBoneOffsets['Bone_010']?.set(-0.12 + headPitch * 0.5, 0.42 + headYaw * 0.5, 0);

      // Character body angled towards books
      this.characterGroup.rotation.y += (this.targetRot.y - this.characterGroup.rotation.y) * 0.06;

    } else if (this.activeSection === 'diagnostico') {
      // ---------------------------------------------------------
      // SECCIÓN 3: DIAGNÓSTICO / EVALUACIÓN (Checklist / Libreta)
      // ---------------------------------------------------------
      // L Arm holding checklist clipboard
      this.targetBoneOffsets['Bone_009']?.set(-0.92, 0.42, 0.28);
      this.targetBoneOffsets['Bone_008']?.set(-0.78, 0.18, 0);
      this.targetBoneOffsets['Bone_007']?.set(0.1, 0.2, 0.15);

      // R Arm holding stylus and checking off items
      const checkBeat = Math.sin(t * 3.2);
      const checkDip = checkBeat > 0.5 ? 0.08 : 0;
      this.targetBoneOffsets['Bone_006']?.set(-0.78, -0.25, -0.32);
      this.targetBoneOffsets['Bone_005']?.set(-0.55 + checkDip, 0.25, 0);
      this.targetBoneOffsets['Bone_004']?.set(0, checkDip * 1.5, 0);

      // Head looking down at checklist then nodding up
      const nod = Math.sin(t * 1.6) * 0.06;
      this.targetBoneOffsets['Bone_011']?.set(0.12 + nod + neckPitch * 0.5, neckYaw * 0.5, 0);
      this.targetBoneOffsets['Bone_010']?.set(0.22 + nod + headPitch * 0.5, headYaw * 0.5, 0);

      this.characterGroup.rotation.y += (this.targetRot.y + mx * 0.18 - this.characterGroup.rotation.y) * 0.06;

    } else if (this.activeSection === 'contacto') {
      // ---------------------------------------------------------
      // SECCIÓN 4: CONTACTO / AGENDA (Señalando Formulario / WhatsApp)
      // ---------------------------------------------------------
      // R Arm extended pointing gesture towards the action buttons
      const pointPulse = Math.sin(t * 2.0) * 0.04;
      this.targetBoneOffsets['Bone_006']?.set(-0.68, -0.72 + pointPulse, -0.62);
      this.targetBoneOffsets['Bone_005']?.set(-0.18, 0.08, 0);
      this.targetBoneOffsets['Bone_004']?.set(0, 0, 0.1);

      // L Arm welcoming open gesture / resting on hip
      this.targetBoneOffsets['Bone_009']?.set(0.12, 0.18, 0.42);
      this.targetBoneOffsets['Bone_008']?.set(-0.48, 0, 0);

      // Head looking towards buttons then warmly towards user
      this.targetBoneOffsets['Bone_011']?.set(neckPitch, -0.15 + neckYaw, 0);
      this.targetBoneOffsets['Bone_010']?.set(headPitch, -0.22 + headYaw, 0);

      this.characterGroup.rotation.y += (this.targetRot.y + mx * 0.2 - this.characterGroup.rotation.y) * 0.06;
    }
  }

  updateProps(t) {
    const isPortafolio = this.activeSection === 'portafolio' || this.isHoveringService;
    const isDiagnostico = this.activeSection === 'diagnostico';
    const isContacto = this.activeSection === 'contacto';

    // Scanner Prop (Section 2)
    if (this.scannerProp) {
      const targetScannerScale = isPortafolio ? 1.0 : 0.0001;
      this.scannerProp.scale.lerp(new THREE.Vector3(targetScannerScale, targetScannerScale, targetScannerScale), 0.1);

      if (isPortafolio) {
        // Pulse laser beam
        const pulse = 0.85 + Math.sin(t * 6) * 0.15;
        this.scannerProp.children.forEach((c) => {
          if (c.material && c.material.opacity !== undefined) {
            c.material.opacity = 0.25 * pulse;
          }
        });
        if (this.propLight) {
          this.propLight.intensity = 1.6 * pulse;
        }
      } else if (this.propLight) {
        this.propLight.intensity = THREE.MathUtils.lerp(this.propLight.intensity, 0, 0.1);
      }
    }

    // Checklist Prop (Section 3)
    if (this.checklistProp) {
      const targetChecklistScale = isDiagnostico ? 1.0 : 0.0001;
      this.checklistProp.scale.lerp(new THREE.Vector3(targetChecklistScale, targetChecklistScale, targetChecklistScale), 0.1);
    }

    // Stylus Prop (Section 3 & 4)
    if (this.stylusProp) {
      const targetStylusScale = isDiagnostico || isContacto ? 1.0 : 0.0001;
      this.stylusProp.scale.lerp(new THREE.Vector3(targetStylusScale, targetStylusScale, targetStylusScale), 0.1);
    }
  }

  jumpToBook(index) {
    if (this.scrollTrigger) {
      const total = this.books.length;
      const targetProgress = index / (total - 1);
      const scrollPos = this.scrollTrigger.start + targetProgress * (this.scrollTrigger.end - this.scrollTrigger.start);
      window.scrollTo({
        top: scrollPos,
        behavior: 'smooth'
      });
    }
  }

  dispose() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('mousemove', this.onMouseMove);

    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }

    this.books.forEach((b) => {
      b.mesh.geometry.dispose();
      b.materials.forEach((m) => {
        if (m.map) m.map.dispose();
        m.dispose();
      });
    });

    this.renderer.dispose();
  }
}
