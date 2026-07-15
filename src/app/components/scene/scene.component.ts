import {
  Component, ElementRef, OnInit, OnDestroy, ViewChild, NgZone, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ScrollService } from '../../services/scroll.service';

interface FloatingPolyhedron {
  mesh: THREE.Mesh;
  speedX: number;
  speedY: number;
  speedZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  basePosition: THREE.Vector3;
}

interface TransformState {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  scale: number;
  displacement: number;
  opacity: number;
}

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas #canvas class="scene-canvas" aria-hidden="true"></canvas>
  `,
  styles: [`
    .scene-canvas {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      z-index: 9999;
      display: block;
      touch-action: none;
      pointer-events: none;
    }
    .scene-debug-overlay {
      position: fixed;
      top: 80px;
      left: 10px;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.85);
      color: #00ff00;
      font-family: monospace;
      padding: 10px;
      font-size: 11px;
      border-radius: 5px;
      pointer-events: none;
      border: 1px solid #00ff00;
      line-height: 1.4;
    }
  `]
})
export class SceneComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;

  // Parallax groups
  private farGroup!: THREE.Group;
  private midGroup!: THREE.Group;
  private nearGroup!: THREE.Group;

  private particleSphere!: THREE.Points;
  private networkNodes: { pos: THREE.Vector3; vel: THREE.Vector3; base: THREE.Vector3 }[] = [];
  private networkPoints!: THREE.Points;
  private networkLines!: THREE.LineSegments;

  private avatarModel!: THREE.Group;
  private holoPlatform!: THREE.Mesh;
  private avatarLocalMinY = 0;

  showDebug = false;
  activeSectionName = 'unknown';
  avatarX = 0;
  avatarY = 0;
  avatarZ = 0;
  modelX = 0;
  modelY = 0;
  heroFound = false;
  aboutFound = false;
  skillsFound = false;
  projectsFound = false;
  expFound = false;
  eduFound = false;
  gitStatsFound = false;
  contactFound = false;

  // Light references for theme transitions
  private taskLight!: THREE.DirectionalLight;
  private warmAmbient!: THREE.AmbientLight;
  private rimLight!: THREE.DirectionalLight;
  private fillLight!: THREE.DirectionalLight;

  private frameId = 0;
  scrollY = 0;
  isGlitchShaking = false;
  private targetScrollY = 0;
  private maxScroll = 1;

  private mouseX = 0;
  private mouseY = 0;

  // Cache section elements
  private heroEl: HTMLElement | null = null;
  private aboutEl: HTMLElement | null = null;
  private skillsEl: HTMLElement | null = null;
  private projectsEl: HTMLElement | null = null;
  private experienceEl: HTMLElement | null = null;
  private educationEl: HTMLElement | null = null;
  private gitStatsEl: HTMLElement | null = null;
  private contactEl: HTMLElement | null = null;

  // Cache section placeholder elements for X coordination mapping
  private heroPlaceholder: HTMLElement | null = null;
  private aboutPlaceholder: HTMLElement | null = null;
  private skillsPlaceholder: HTMLElement | null = null;
  private projectsPlaceholder: HTMLElement | null = null;
  private experiencePlaceholder: HTMLElement | null = null;
  private educationPlaceholder: HTMLElement | null = null;
  private gitStatsPlaceholder: HTMLElement | null = null;
  private contactPlaceholder: HTMLElement | null = null;

  // State definitions for desktop & mobile
  private desktopStates = {
    hero: { x: 0.0, y: -0.02, z: 2.0, rx: 0.05, ry: -0.60, rz: 0, scale: 3.1, displacement: 0.0, opacity: 1.0 },
    about: { x: -1.8, y: -0.02, z: 2.0, rx: -0.15, ry: 0.65, rz: 0.05, scale: 3.1, displacement: 0.0, opacity: 1.0 },
    skills: { x: 1.8, y: -0.02, z: 2.0, rx: 0.1, ry: -0.6, rz: 0.05, scale: 3.1, displacement: 0.0, opacity: 1.0 },
    projects: { x: -1.8, y: -0.02, z: 2.0, rx: -0.05, ry: 0.7, rz: -0.02, scale: 3.1, displacement: 0.0, opacity: 1.0 },
    experience: { x: 1.8, y: -0.02, z: 2.0, rx: 0.05, ry: -0.5, rz: 0.0, scale: 3.1, displacement: 0.0, opacity: 1.0 },
    education: { x: -1.8, y: -0.02, z: 2.0, rx: 0.05, ry: 0.5, rz: 0.0, scale: 3.1, displacement: 0.0, opacity: 1.0 },
    gitStats: { x: 0.0, y: -0.10, z: 2.0, rx: 0.0, ry: 0.0, rz: 0.0, scale: 3.5, displacement: 0.0, opacity: 1.0 },
    contact: { x: -1.8, y: -0.02, z: 2.0, rx: 0.0, ry: 0.5, rz: 0.0, scale: 3.1, displacement: 0.0, opacity: 0.0 }
  };

  private mobileStates = {
    hero: { x: 0.0, y: -0.95, z: 0.0, rx: 0, ry: 0, rz: 0, scale: 1.8, displacement: 0.0, opacity: 0.4 },
    about: { x: 0.0, y: -0.95, z: 0.0, rx: 0, ry: 0.0, rz: 0, scale: 1.8, displacement: 0.0, opacity: 0.4 },
    skills: { x: 0.0, y: -0.95, z: 0.0, rx: 0, ry: 0.0, rz: 0, scale: 1.8, displacement: 0.0, opacity: 0.4 },
    projects: { x: 0.0, y: -0.95, z: 0.0, rx: 0, ry: 0.0, rz: 0, scale: 1.8, displacement: 0.0, opacity: 0.4 },
    experience: { x: 0.0, y: -0.95, z: 0.0, rx: 0, ry: 0, rz: 0, scale: 1.8, displacement: 0.0, opacity: 0.4 },
    education: { x: 0.0, y: -0.95, z: 0.0, rx: 0, ry: 0, rz: 0, scale: 1.8, displacement: 0.0, opacity: 0.4 },
    gitStats: { x: 0.0, y: -0.95, z: 0.0, rx: 0, ry: 0, rz: 0, scale: 1.8, displacement: 0.0, opacity: 0.4 },
    contact: { x: 0.0, y: -0.95, z: 0.0, rx: 0, ry: 0, rz: 0, scale: 1.8, displacement: 0.0, opacity: 0.0 }
  };

  constructor(private zone: NgZone, private scrollService: ScrollService) { }

  ngOnInit() {
    this.initScene();
    this.setupLayers();
    this.loadAvatar();
    this.updateMaxScroll();

    // Cache page section offsets after rendering
    setTimeout(() => {
      this.heroEl = document.getElementById('hero');
      this.aboutEl = document.getElementById('about');
      this.skillsEl = document.getElementById('skills');
      this.projectsEl = document.getElementById('projects');
      this.experienceEl = document.getElementById('experience');
      this.educationEl = document.getElementById('education');
      this.gitStatsEl = document.getElementById('git-stats');
      this.contactEl = document.querySelector('app-contact') || document.getElementById('contact');

      // Placeholders for X coordinates mapping
      this.heroPlaceholder = document.getElementById('hero-frame');
      this.aboutPlaceholder = document.querySelector('#about .about-photo-wrap');
      this.skillsPlaceholder = document.querySelector('#skills .skills-right-col');
      this.projectsPlaceholder = document.querySelector('#projects .projects-left-col');
      this.experiencePlaceholder = document.querySelector('#experience .experience-right-col');
      this.educationPlaceholder = document.querySelector('#education .education-left-col');
      this.gitStatsPlaceholder = document.getElementById('git-stats-placeholder');
      this.contactPlaceholder = document.querySelector('#contact .contact-photo-frame');
    }, 800);

    this.zone.runOutsideAngular(() => this.animate());
  }

  private initScene() {
    const canvas = this.canvasRef.nativeElement;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new THREE.Scene();

    // Dark abyssal teal theme fog default
    this.scene.fog = new THREE.FogExp2(0x012624, 0.085);

    this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    this.camera.position.set(0, 0.1, 8.5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Controls setup
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 4;
    this.controls.maxDistance = 18;
    this.controls.maxPolarAngle = Math.PI / 2.2;
    this.controls.target.set(0, 0.1, 0);
    this.controls.update();

    // Standard lighting for Auros dark void environment
    this.taskLight = new THREE.DirectionalLight(0xcbfffc, 3.5);
    this.taskLight.position.set(-5, 6, 4);
    this.taskLight.castShadow = true;
    this.taskLight.shadow.mapSize.set(1024, 1024);
    this.scene.add(this.taskLight);

    this.warmAmbient = new THREE.AmbientLight(0x003734, 1.2);
    this.scene.add(this.warmAmbient);

    this.rimLight = new THREE.DirectionalLight(0x00827c, 2.5);
    this.rimLight.position.set(0, 2, -5);
    this.scene.add(this.rimLight);

    this.fillLight = new THREE.DirectionalLight(0xfff8f0, 1.0);
    this.fillLight.position.set(4, 1, 3);
    this.scene.add(this.fillLight);

    window.addEventListener('resize', this.onResize);
  }

  private setupLayers() {
    // 1. Far Group: Particle Sphere and Background stars
    this.farGroup = new THREE.Group();
    this.scene.add(this.farGroup);

    // Bioluminescent Particle Sphere
    const particleCount = 600;
    const sphereGeo = new THREE.BufferGeometry();
    const spherePositions = new Float32Array(particleCount * 3);
    const sphereColors = new Float32Array(particleCount * 3);

    const colorTeal = new THREE.Color('#00827c');
    const colorCyan = new THREE.Color('#cbfffc');
    const colorLavender = new THREE.Color('#fad1ff');

    for (let i = 0; i < particleCount; i++) {
      // Fibonacci lattice distribution on a sphere
      const k = i + 0.5;
      const phi = Math.acos(1 - (2 * k) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * k;

      const r = 1.9 + Math.random() * 0.12; // Radius
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      spherePositions[i * 3] = x;
      spherePositions[i * 3 + 1] = y;
      spherePositions[i * 3 + 2] = z;

      // Blend from teal to cyan to lavender
      const mixColor = new THREE.Color();
      const rand = Math.random();
      if (rand < 0.45) {
        mixColor.lerpColors(colorTeal, colorCyan, Math.random());
      } else if (rand < 0.85) {
        mixColor.lerpColors(colorCyan, colorLavender, Math.random());
      } else {
        mixColor.copy(colorTeal);
      }

      sphereColors[i * 3] = mixColor.r;
      sphereColors[i * 3 + 1] = mixColor.g;
      sphereColors[i * 3 + 2] = mixColor.b;
    }

    sphereGeo.setAttribute('position', new THREE.BufferAttribute(spherePositions, 3));
    sphereGeo.setAttribute('color', new THREE.BufferAttribute(sphereColors, 3));

    const sphereMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particleSphere = new THREE.Points(sphereGeo, sphereMat);
    this.particleSphere.position.set(0, 0, -1.8);
    this.scene.add(this.particleSphere);

    // Far background stars/particles
    const farParticlesCount = 180;
    const farGeo = new THREE.BufferGeometry();
    const farPositions = new Float32Array(farParticlesCount * 3);
    for (let i = 0; i < farParticlesCount * 3; i += 3) {
      farPositions[i] = (Math.random() - 0.5) * 16;
      farPositions[i + 1] = (Math.random() - 0.5) * 12;
      farPositions[i + 2] = (Math.random() - 0.5) * 10 - 6;
    }
    farGeo.setAttribute('position', new THREE.BufferAttribute(farPositions, 3));
    const farMat = new THREE.PointsMaterial({
      color: 0x00827c,
      size: 0.035,
      transparent: true,
      opacity: 0.35
    });
    const farParticles = new THREE.Points(farGeo, farMat);
    this.farGroup.add(farParticles);

    // 2. Mid: Node-Network Diagram Plexus
    this.midGroup = new THREE.Group();
    this.scene.add(this.midGroup);

    const nodeCount = 35;
    for (let i = 0; i < nodeCount; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 3 - 2.5
      );
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.002
      );
      this.networkNodes.push({ pos, vel, base: pos.clone() });
    }

    const pointsGeo = new THREE.BufferGeometry();
    const pointsPositions = new Float32Array(nodeCount * 3);
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(pointsPositions, 3));
    const pointsMat = new THREE.PointsMaterial({
      color: 0xedfffe,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    this.networkPoints = new THREE.Points(pointsGeo, pointsMat);
    this.midGroup.add(this.networkPoints);

    // Connecting lines segments
    const linesGeo = new THREE.BufferGeometry();
    const maxLineConnections = 120;
    const linesPositions = new Float32Array(maxLineConnections * 2 * 3);
    linesGeo.setAttribute('position', new THREE.BufferAttribute(linesPositions, 3));
    const linesMat = new THREE.LineBasicMaterial({
      color: 0x00827c,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.networkLines = new THREE.LineSegments(linesGeo, linesMat);
    this.midGroup.add(this.networkLines);

    // 3. Near: fast front particles
    this.nearGroup = new THREE.Group();
    this.scene.add(this.nearGroup);

    const nearParticlesCount = 80;
    const nearGeo = new THREE.BufferGeometry();
    const nearPositions = new Float32Array(nearParticlesCount * 3);
    for (let i = 0; i < nearParticlesCount * 3; i += 3) {
      nearPositions[i] = (Math.random() - 0.5) * 8;
      nearPositions[i + 1] = (Math.random() - 0.5) * 8;
      nearPositions[i + 2] = (Math.random() - 0.5) * 6 + 1.5;
    }
    nearGeo.setAttribute('position', new THREE.BufferAttribute(nearPositions, 3));
    const nearMat = new THREE.PointsMaterial({
      color: 0xcbfffc,
      size: 0.04,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const nearParticles = new THREE.Points(nearGeo, nearMat);
    this.nearGroup.add(nearParticles);
  }

  private loadAvatar() {
    // 1. Holographic Base Platform (Scaled down to fit feet compactly)
    const platGeo = new THREE.CylinderGeometry(0.4, 0.45, 0.06, 32);
    const platMat = new THREE.MeshStandardMaterial({
      color: 0x007a99,
      roughness: 0.15,
      metalness: 0.85,
      emissive: 0x007a99,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.65
    });
    this.holoPlatform = new THREE.Mesh(platGeo, platMat);
    this.holoPlatform.position.set(0, -0.85, 2.0);
    this.scene.add(this.holoPlatform);

    // 2. Load 3D GLB Character Model
    const loader = new GLTFLoader();
    loader.load(
      'assets/images/3dModel/Blue Suit Man.glb',
      (gltf) => {
        this.avatarModel = gltf.scene;

        // Scale and center the model initially (match hero target state)
        this.avatarModel.scale.set(2.0, 2.0, 2.0);
        this.avatarModel.position.set(0, -0.85, 2.0);

        // Apply shader overrides on the mesh children for curves/nerves displacement
        this.avatarModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child.material) {
              const mats = Array.isArray(child.material) ? child.material : [child.material];
              mats.forEach((mat) => {
                const sMat = mat as THREE.MeshStandardMaterial;
                sMat.roughness = 0.35;
                sMat.metalness = 0.4;
                sMat.transparent = true;
                sMat.opacity = 1.0;

                // Shader injection
                sMat.onBeforeCompile = (shader) => {
                  shader.uniforms['uTime'] = { value: 0 };
                  shader.uniforms['uDisplacementStrength'] = { value: 0 };

                  shader.vertexShader = `
                    uniform float uTime;
                    uniform float uDisplacementStrength;
                  ` + shader.vertexShader;

                  shader.vertexShader = shader.vertexShader.replace(
                    '#include <begin_vertex>',
                    `
                    #include <begin_vertex>
                    if (uDisplacementStrength > 0.0) {
                      float pulse = sin(transformed.y * 10.0 + uTime * 4.0) * 0.07 * uDisplacementStrength;
                      transformed.x += pulse;
                      transformed.z += cos(transformed.y * 10.0 + uTime * 4.0) * 0.07 * uDisplacementStrength;
                      transformed.y += sin(transformed.x * 6.0 + uTime * 3.0) * 0.03 * uDisplacementStrength;
                    }
                    `
                  );
                  sMat.userData['shader'] = shader;
                };
                sMat.needsUpdate = true;
              });
            }
          }
        });

        // Calculate the local Y coordinate of the avatar's bottom (feet) relative to origin
        const box = new THREE.Box3().setFromObject(this.avatarModel);
        this.avatarLocalMinY = (box.min.y - this.avatarModel.position.y) / this.avatarModel.scale.y;

        // Add avatar directly to root scene so its position math is absolute
        this.scene.add(this.avatarModel);

        // Notify body styling that model is loaded
        document.body.classList.add('gltf-loaded');
        window.dispatchEvent(new CustomEvent('gltf-loaded'));
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          window.dispatchEvent(new CustomEvent('gltf-progress', { detail: { progress: percent } }));
        }
      },
      (err) => console.error('Error loading blue-suit-man GLB model:', err)
    );
  }



  private onResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.updateMaxScroll();
  };

  private updateMaxScroll() {
    this.maxScroll = window.innerHeight * 7;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  private updateGroupOpacity(group: THREE.Object3D, opacity: number) {
    if (!group) return;
    group.traverse((child) => {
      try {
        if (child instanceof THREE.Mesh) {
          if (child.material) {
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach((mat) => {
              if (mat) {
                mat.transparent = true;
                mat.opacity = opacity;
              }
            });
          }
        } else if (child instanceof THREE.Points) {
          if (child.material) {
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach((mat) => {
              if (mat) {
                mat.transparent = true;
                mat.opacity = opacity;
              }
            });
          }
        }
      } catch (err) {
        // Safe catch
      }
    });
  }

  private animate = () => {
    this.frameId = requestAnimationFrame(this.animate);

    this.maxScroll = window.innerHeight * 7;

    // Get virtual scroll from ScrollService
    this.targetScrollY = this.scrollService.getVirtualScrollY();

    // Directly match target scroll Y since GSAP already provides smooth ease-out
    this.scrollY = this.targetScrollY;
    const progress = Math.min(1, Math.max(0, this.scrollY / this.maxScroll));

    const t = performance.now() * 0.001;

    // Convert scrollY into 3D units for Parallax
    const scroll3D = this.scrollY * 0.0035;

    // Apply scroll parallax translation
    this.farGroup.position.y = scroll3D * 0.12;
    this.midGroup.position.y = scroll3D * 0.3;
    this.nearGroup.position.y = scroll3D * 0.65;

    // Scroll-driven independent opacity dissolves
    const farOpacity = Math.max(0, 1 - progress / 0.45);

    let midOpacity = 1;
    if (progress < 0.25) {
      midOpacity = 1;
    } else if (progress > 0.65) {
      midOpacity = 0;
    } else {
      midOpacity = 1 - (progress - 0.25) / 0.4;
    }

    let nearOpacity = 1;
    if (progress < 0.4) {
      nearOpacity = 1;
    } else if (progress > 0.85) {
      nearOpacity = 0;
    } else {
      nearOpacity = 1 - (progress - 0.4) / 0.45;
    }

    this.updateGroupOpacity(this.farGroup, farOpacity);
    this.updateGroupOpacity(this.midGroup, midOpacity);
    this.updateGroupOpacity(this.nearGroup, nearOpacity);

    // Adjust studio lighting and fog dynamically based on theme (default dark, light-theme is day)
    const isLight = document.body.classList.contains('light-theme');
    const targetFog = isLight ? 0xf5f7fa : 0x060608; // Fog matches start of background gradients
    const targetAmbient = isLight ? 0xdbe2e8 : 0x0a1424;
    const targetTask = isLight ? 0xffffff : 0x00d4ff;
    const targetRim = isLight ? 0xaacbe3 : 0x7a22cc;

    if (this.scene.fog instanceof THREE.FogExp2) {
      this.scene.fog.color.set(targetFog);
      this.scene.fog.density = isLight ? 0.02 : 0.085;
    }

    this.taskLight.color.set(targetTask);
    this.taskLight.intensity = isLight ? 4.0 : 3.5;

    this.warmAmbient.color.set(targetAmbient);
    this.warmAmbient.intensity = isLight ? 2.5 : 1.2;

    this.rimLight.color.set(targetRim);
    this.rimLight.intensity = isLight ? 3.0 : 2.5;

    if (this.fillLight) {
      this.fillLight.color.set(isLight ? 0xffffff : 0xfff8f0);
      this.fillLight.intensity = isLight ? 2.0 : 1.0;
    }

    // Particle Sphere rotation
    if (this.particleSphere) {
      this.particleSphere.rotation.y = t * 0.08;
      this.particleSphere.rotation.x = t * 0.04;
    }

    // Platform animation
    if (this.holoPlatform) {
      this.holoPlatform.rotation.y = t * 0.4;
      const platMat = this.holoPlatform.material as THREE.MeshStandardMaterial;
      // Light blue palette in light/blue theme, teal palette in dark/teal theme
      platMat.color.set(isLight ? 0x00d9ff : 0x1abfaf);
      platMat.emissive.set(isLight ? 0x00d9ff : 0x1abfaf);
      platMat.emissiveIntensity = isLight ? 0.6 : 0.85;
    }

    // Update Node-Network Diagram Plexus
    if (this.networkPoints && this.networkLines) {
      const pointsPosAttr = this.networkPoints.geometry.getAttribute('position') as THREE.BufferAttribute;
      const linesPosAttr = this.networkLines.geometry.getAttribute('position') as THREE.BufferAttribute;

      const nodeCount = this.networkNodes.length;
      const maxDist = 2.2;
      const maxLineConnections = 120;
      let lineIndex = 0;

      // Update positions
      for (let i = 0; i < nodeCount; i++) {
        const node = this.networkNodes[i];
        node.pos.add(node.vel);

        // Gentle boundary bounce
        if (Math.abs(node.pos.x - node.base.x) > 1.5) node.vel.x *= -1;
        if (Math.abs(node.pos.y - node.base.y) > 1.5) node.vel.y *= -1;
        if (Math.abs(node.pos.z - node.base.z) > 1.0) node.vel.z *= -1;

        pointsPosAttr.setXYZ(i, node.pos.x, node.pos.y, node.pos.z);
      }
      pointsPosAttr.needsUpdate = true;

      // Calculate connections
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const nodeA = this.networkNodes[i];
          const nodeB = this.networkNodes[j];
          const dist = nodeA.pos.distanceTo(nodeB.pos);

          if (dist < maxDist && lineIndex < maxLineConnections) {
            linesPosAttr.setXYZ(lineIndex * 2, nodeA.pos.x, nodeA.pos.y, nodeA.pos.z);
            linesPosAttr.setXYZ(lineIndex * 2 + 1, nodeB.pos.x, nodeB.pos.y, nodeB.pos.z);
            lineIndex++;
          }
        }
      }

      // Clear unused lines in buffer
      for (let i = lineIndex; i < maxLineConnections; i++) {
        linesPosAttr.setXYZ(i * 2, 0, 0, 0);
        linesPosAttr.setXYZ(i * 2 + 1, 0, 0, 0);
      }
      linesPosAttr.needsUpdate = true;
    }

    // Scroll Transition interpolation mapping for the Avatar
    const windowHeight = window.innerHeight;
    const isMobile = window.innerWidth < 992;

    const heroTop = 0;
    const aboutTop = windowHeight;
    const skillsTop = windowHeight * 2;
    const projectsTop = windowHeight * 3;
    const experienceTop = windowHeight * 4;
    const educationTop = windowHeight * 5;
    const gitStatsTop = windowHeight * 6;
    const contactTop = windowHeight * 7;

    const heroState = isMobile ? this.mobileStates.hero : {
      ...this.desktopStates.hero,
      x: this.getXFromElement(this.heroPlaceholder, this.desktopStates.hero.z, this.desktopStates.hero.x)
    };
    const aboutState = isMobile ? this.mobileStates.about : {
      ...this.desktopStates.about,
      x: this.getXFromElement(this.aboutPlaceholder, this.desktopStates.about.z, this.desktopStates.about.x)
    };
    const skillsState = isMobile ? this.mobileStates.skills : {
      ...this.desktopStates.skills,
      x: this.getXFromElement(this.skillsPlaceholder, this.desktopStates.skills.z, this.desktopStates.skills.x)
    };
    const projectsState = isMobile ? this.mobileStates.projects : {
      ...this.desktopStates.projects,
      x: this.getXFromElement(this.projectsPlaceholder, this.desktopStates.projects.z, this.desktopStates.projects.x)
    };
    const experienceState = isMobile ? this.mobileStates.experience : {
      ...this.desktopStates.experience,
      x: this.getXFromElement(this.experiencePlaceholder, this.desktopStates.experience.z, this.desktopStates.experience.x)
    };
    const educationState = isMobile ? this.mobileStates.education : {
      ...this.desktopStates.education,
      x: this.getXFromElement(this.educationPlaceholder, this.desktopStates.education.z, this.desktopStates.education.x)
    };
    const gitStatsState = isMobile ? this.mobileStates.gitStats : {
      ...this.desktopStates.gitStats,
      x: this.getXFromElement(this.gitStatsPlaceholder, this.desktopStates.gitStats.z, this.desktopStates.gitStats.x)
    };
    const contactState = isMobile ? this.mobileStates.contact : {
      ...this.desktopStates.contact,
      x: this.getXFromElement(this.contactPlaceholder, this.desktopStates.contact.z, this.desktopStates.contact.x)
    };

    const sections = [
      { top: heroTop, state: heroState },
      { top: aboutTop, state: aboutState },
      { top: skillsTop, state: skillsState },
      { top: projectsTop, state: projectsState },
      { top: experienceTop, state: experienceState },
      { top: educationTop, state: educationState },
      { top: gitStatsTop, state: gitStatsState },
      { top: contactTop, state: contactState }
    ];

    // Sort by vertical offsets
    sections.sort((a, b) => a.top - b.top);

    // Find current interval target state
    let target = { ...sections[0].state };
    let found = false;
    for (let i = 0; i < sections.length - 1; i++) {
      if (this.scrollY >= sections[i].top && this.scrollY < sections[i + 1].top) {
        const dist = sections[i + 1].top - sections[i].top;
        const factor = dist > 0 ? (this.scrollY - sections[i].top) / dist : 0;

        target.x = sections[i].state.x + (sections[i + 1].state.x - sections[i].state.x) * factor;
        target.y = sections[i].state.y + (sections[i + 1].state.y - sections[i].state.y) * factor;
        target.z = sections[i].state.z + (sections[i + 1].state.z - sections[i].state.z) * factor;
        target.rx = sections[i].state.rx + (sections[i + 1].state.rx - sections[i].state.rx) * factor;
        target.ry = sections[i].state.ry + (sections[i + 1].state.ry - sections[i].state.ry) * factor;
        target.rz = sections[i].state.rz + (sections[i + 1].state.rz - sections[i].state.rz) * factor;
        target.scale = sections[i].state.scale + (sections[i + 1].state.scale - sections[i].state.scale) * factor;
        target.displacement = sections[i].state.displacement + (sections[i + 1].state.displacement - sections[i].state.displacement) * factor;
        target.opacity = sections[i].state.opacity + (sections[i + 1].state.opacity - sections[i].state.opacity) * factor;
        found = true;
        break;
      }
    }
    if (!found && this.scrollY >= sections[sections.length - 1].top) {
      target = { ...sections[sections.length - 1].state };
    }

    // Apply target transitions to Avatar model
    if (this.avatarModel) {
      const lerpFactor = 0.1; // Smooth organic transition tracking (go with the flow)

      let jitterX = 0;
      let jitterY = 0;
      let jitterZ = 0;
      if (this.isGlitchShaking) {
        jitterX = (Math.random() - 0.5) * 0.18;
        jitterY = (Math.random() - 0.5) * 0.18;
        jitterZ = (Math.random() - 0.5) * 0.12;
      }

      this.avatarModel.position.x += (target.x + jitterX - this.avatarModel.position.x) * lerpFactor;
      // Gentle breathing overlay added on Y
      const breathing = Math.sin(t * 1.2) * 0.01;
      this.avatarModel.position.y += (target.y + breathing + jitterY - this.avatarModel.position.y) * lerpFactor;
      this.avatarModel.position.z += (target.z + jitterZ - this.avatarModel.position.z) * lerpFactor;

      // Update debug overlays
      this.avatarX = target.x;
      this.avatarY = target.y;
      this.avatarZ = target.z;
      this.modelX = this.avatarModel.position.x;
      this.modelY = this.avatarModel.position.y;
      this.heroFound = !!this.heroPlaceholder;
      this.aboutFound = !!this.aboutPlaceholder;
      this.skillsFound = !!this.skillsPlaceholder;
      this.projectsFound = !!this.projectsPlaceholder;
      this.expFound = !!this.experiencePlaceholder;
      this.eduFound = !!this.educationPlaceholder;
      this.gitStatsFound = !!this.gitStatsPlaceholder;
      this.contactFound = !!this.contactPlaceholder;

      let activeName = 'none';
      for (let i = 0; i < sections.length; i++) {
        if (i === sections.length - 1 || (this.scrollY >= sections[i].top && this.scrollY < sections[i + 1].top)) {
          activeName = sections[i].top === heroTop ? 'hero' :
            sections[i].top === aboutTop ? 'about' :
              sections[i].top === skillsTop ? 'skills' :
                sections[i].top === projectsTop ? 'projects' :
                  sections[i].top === experienceTop ? 'experience' :
                    sections[i].top === educationTop ? 'education' :
                      sections[i].top === gitStatsTop ? 'gitStats' : 'contact';
          break;
        }
      }
      this.activeSectionName = activeName;

      // Mouse Parallax Influence
      const mouseRotY = this.mouseX * 0.28;
      const mouseRotX = -this.mouseY * 0.12;

      this.avatarModel.rotation.x += (target.rx + mouseRotX - this.avatarModel.rotation.x) * lerpFactor;
      this.avatarModel.rotation.y += (target.ry + mouseRotY - this.avatarModel.rotation.y) * lerpFactor;
      this.avatarModel.rotation.z += (target.rz - this.avatarModel.rotation.z) * lerpFactor;

      const currentScale = this.avatarModel.scale.x;
      const nextScale = currentScale + (target.scale - currentScale) * lerpFactor;
      this.avatarModel.scale.set(nextScale, nextScale, nextScale);

      // Pass variables to standard shaders
      this.avatarModel.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((mat) => {
            if (mat.userData && mat.userData['shader']) {
              const shader = mat.userData['shader'];
              shader.uniforms['uTime'].value = t;
              const currentDisp = shader.uniforms['uDisplacementStrength'].value;
              const targetDisp = this.isGlitchShaking ? (0.6 + Math.random() * 0.7) : target.displacement;
              shader.uniforms['uDisplacementStrength'].value = currentDisp + (targetDisp - currentDisp) * lerpFactor;
            }
          });
        }
      });

      // Synchronize the stage (platform) position, scale, and opacity with the avatar model
      if (this.holoPlatform) {
        this.holoPlatform.position.x = this.avatarModel.position.x;
        // Keep the stage exactly below the feet by subtracting the half-height of the platform cylinder (0.03) scaled dynamically
        this.holoPlatform.position.y = this.avatarModel.position.y + (this.avatarLocalMinY * this.avatarModel.scale.y) - (0.03 * this.avatarModel.scale.y) - 0.005;
        this.holoPlatform.position.z = this.avatarModel.position.z;
        this.holoPlatform.scale.copy(this.avatarModel.scale);
      }

      // Synchronize the background Orb (particle sphere) position, scale, and opacity with the avatar model
      if (this.particleSphere) {
        const avatarScale = this.avatarModel.scale.y;

        // Position directly behind the avatar's body/torso center (around 0.65 of its scaled height)
        this.particleSphere.position.x = this.avatarModel.position.x;
        this.particleSphere.position.y = this.avatarModel.position.y + ((-0.1) * avatarScale);
        this.particleSphere.position.z = this.avatarModel.position.z - 3.8;

        // Scale in proportion to the avatar, but clamp it to prevent the Orb from growing too large and saturating the screen
        const sphereScale = 1.0 + Math.sin(t * 1.5) * 0.03;
        const scaleMultiplier = Math.min(1.2, avatarScale * 0.45);
        this.particleSphere.scale.setScalar(sphereScale * scaleMultiplier);

        // Match opacity transitions of the avatar and keep it subtle (0.55 max opacity)
        const sphereMat = this.particleSphere.material as THREE.PointsMaterial;
        sphereMat.opacity = target.opacity * 0.55;
      }
    }

    const canvas = this.canvasRef.nativeElement;
    const activePage = this.scrollService.getActivePage();
    if (activePage === 7 || target.opacity <= 0.01) {
      canvas.style.opacity = '0';
      canvas.style.zIndex = '-1';
    } else {
      canvas.style.opacity = target.opacity.toString();
      canvas.style.zIndex = '9999';
    }

    // Camera target offsets slightly toward cursor
    this.controls.target.x += (this.mouseX * 0.35 - this.controls.target.x) * 0.05;
    this.controls.target.y += (this.mouseY * 0.28 - this.controls.target.y) * 0.05;

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  private getXFromElement(el: HTMLElement | null, z: number, fallbackX: number): number {
    if (!el || window.innerWidth < 992) return fallbackX;

    // Get screen-space X coordinate of the element center
    const rect = el.getBoundingClientRect();
    const elemCenterX = rect.left + rect.width / 2;
    const ndcX = (elemCenterX / window.innerWidth) * 2 - 1;

    // Project NDC to 3D world coordinate at target Z depth
    const distance = this.camera.position.z - z;
    const visibleHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 360) * distance;
    const visibleWidth = visibleHeight * this.camera.aspect;

    return ndcX * (visibleWidth / 2);
  }

  private getElementTop(el: HTMLElement | null, fallbackTop: number): number {
    if (!el) return fallbackTop;
    return el.getBoundingClientRect().top + window.scrollY;
  }

  @HostListener('window:avatar-shake')
  onAvatarShake() {
    this.isGlitchShaking = true;
    setTimeout(() => {
      this.isGlitchShaking = false;
    }, 2500);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.onResize);
    this.controls?.dispose();
    this.renderer?.dispose();
  }
}

