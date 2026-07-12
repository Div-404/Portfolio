import {
  Component, ElementRef, OnInit, OnDestroy, ViewChild, NgZone, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #canvas class="scene-canvas" aria-hidden="true"></canvas>`,
  styles: [`.scene-canvas { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; display: block; touch-action: none; }`]
})
export class SceneComponent implements OnInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private model!: THREE.Group;
  private particles: THREE.Mesh[] = [];
  private rings: THREE.Mesh[] = [];
  private frameId = 0;
  private scrollY = 0;
  private targetScrollY = 0;

  constructor(private zone: NgZone) { }

  ngOnInit() {
    this.initScene();
    this.loadModel();
    this.createParticles();
    this.createRings();
    this.zone.runOutsideAngular(() => this.animate());
  }

  private initScene() {
    const canvas = this.canvasRef.nativeElement;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
    this.camera.position.set(0, 0.5, 6);
    this.camera.lookAt(0, 0, 0);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    const amb = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(amb);
    const key = new THREE.DirectionalLight(0x00d4ff, 1.2);
    key.position.set(3, 5, 4);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xa78bfa, 0.8);
    fill.position.set(-4, 1, -3);
    this.scene.add(fill);
    const rim = new THREE.DirectionalLight(0x10b981, 0.4);
    rim.position.set(0, 3, -5);
    this.scene.add(rim);
    window.addEventListener('resize', this.onResize);
  }

  private loadModel() {
    const loader = new GLTFLoader();
    loader.load('assets/images/3dModel/Blue Suit Man.glb', (gltf) => {
      this.model = gltf.scene;
      this.model.traverse((child) => { if (child instanceof THREE.Mesh) { child.castShadow = true; child.receiveShadow = true; } });
      const box = new THREE.Box3().setFromObject(this.model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const s = 3.5 / maxDim;
      this.model.scale.set(s, s, s);
      const center = box.getCenter(new THREE.Vector3());
      this.model.position.sub(center.clone().multiplyScalar(s));
      this.model.position.y += 0.2;
      this.scene.add(this.model);
    }, undefined, (error) => console.error('Error loading 3D model:', error));
  }

  private createParticles() {
    const colors = [0x00d4ff, 0xa78bfa, 0x10b981];
    for (let i = 0; i < 20; i++) {
      const geo = new THREE.SphereGeometry(0.03 + Math.random() * 0.05, 8, 8);
      const mat = new THREE.MeshBasicMaterial({ color: colors[i % colors.length], transparent: true, opacity: 0.4 + Math.random() * 0.3 });
      const mesh = new THREE.Mesh(geo, mat);
      const radius = 1.8 + Math.random() * 1.5;
      mesh.position.set(Math.cos(Math.random() * Math.PI * 2) * radius, (Math.random() - 0.5) * 2.5, Math.sin(Math.random() * Math.PI * 2) * radius);
      (mesh as any).userData = { angle: Math.random() * Math.PI * 2, radius, height: (Math.random() - 0.5) * 2.5, speed: 0.2 + Math.random() * 0.3, offset: Math.random() * Math.PI * 2 };
      this.scene.add(mesh);
      this.particles.push(mesh);
    }
  }

  private createRings() {
    for (let i = 0; i < 3; i++) {
      const geo = new THREE.TorusGeometry(1.5 + i * 0.4, 0.03, 16, 80);
      const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(0.55 + i * 0.08, 0.8, 0.5), transparent: true, opacity: 0.15 + i * 0.05 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = Math.PI / 2.5;
      mesh.rotation.z = i * 0.3;
      mesh.position.y = -0.2;
      this.scene.add(mesh);
      this.rings.push(mesh);
    }
  }

  private onResize = () => {
    const w = window.innerWidth; const h = window.innerHeight;
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  @HostListener('window:scroll')
  onScroll() { this.targetScrollY = window.scrollY; }

  private animate = () => {
    this.frameId = requestAnimationFrame(this.animate);
    this.scrollY += (this.targetScrollY - this.scrollY) * 0.07;
    const t = performance.now() * 0.001;
    if (this.model) {
      this.model.rotation.y += 0.004;
      this.model.rotation.x += 0.001;
      this.model.position.y = Math.sin(t * 0.8) * 0.3;
      const fade = Math.max(0, 1 - this.scrollY * 0.0015);
      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const m = child.material as THREE.MeshStandardMaterial;
          if (m && !Array.isArray(m)) m.opacity = fade;
        }
      });
    }
    for (const p of this.particles) {
      const ud = (p as any).userData;
      const angle = ud.angle + t * ud.speed * 0.3;
      p.position.x = Math.cos(angle) * ud.radius;
      p.position.z = Math.sin(angle) * ud.radius;
      p.position.y = ud.height + Math.sin(t * ud.speed + ud.offset) * 0.3;
    }
    for (let i = 0; i < this.rings.length; i++) {
      this.rings[i].rotation.y = t * (0.1 + i * 0.05);
      this.rings[i].rotation.x = Math.PI / 2.5 + Math.sin(t * 0.2 + i) * 0.05;
    }
    this.renderer.render(this.scene, this.camera);
  };

  ngOnDestroy() {
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.onResize);
    this.renderer?.dispose();
  }
}
