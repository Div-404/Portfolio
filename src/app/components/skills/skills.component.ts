import {
  Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

interface PhysicsSphere {
  group: THREE.Group;
  sphereMesh: THREE.Mesh;
  labelMesh: THREE.Mesh;
  velocity: THREE.Vector3;
  radius: number;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="skills" class="reveal">
      <div class="skills-section-grid">
        <div class="skills-left-col">
          <div class="section-label">02 / Tech Stack</div>
          <h2 class="section-h2">Skills &amp; <span>Capabilities</span></h2>
          
          <div class="skills-container" #container
               (mousemove)="onMouseMove($event)"
               (mouseleave)="onMouseLeave()">
            <canvas #skillsCanvas class="skills-canvas"></canvas>
            <div class="skills-tip">Hover and move your mouse to play with the tech cloud</div>
          </div>
        </div>
        <div class="skills-right-col">
          <!-- Empty column for 3D Avatar space -->
        </div>
      </div>
    </section>
  `,
  styles: [`
    #skills {
      padding: 7rem 0;
    }
    .skills-container {
      width: 100%;
      height: 600px;
      position: relative;
      background: var(--glass);
      border: 1px solid var(--glass-b);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: var(--shadow);
      backdrop-filter: blur(30px) saturate(190%);
      -webkit-backdrop-filter: blur(30px) saturate(190%);
    }
    .skills-canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
    .skills-tip {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      font-family: var(--font-m);
      font-size: 0.8rem;
      letter-spacing: 0.08em;
      color: var(--white);
      pointer-events: none;
      background: var(--glass-bh);
      padding: 6px 16px;
      border-radius: 30px;
      border: 1px solid var(--glass-b);
      backdrop-filter: blur(12px);
    }
    @media (max-width: 768px) {
      .skills-container {
        height: 450px;
      }
    }
  `]
})
export class SkillsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('skillsCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  skills = [
    { name: 'Angular', level: '95%', icon: '🅰️', c1: '#ff3366', c2: '#b8002c', txt: '#ffffff' },
    { name: 'TypeScript', level: '90%', icon: '🔷', c1: '#007acc', c2: '#00599c', txt: '#ffffff' },
    { name: 'JavaScript', level: '95%', icon: '🟨', c1: '#f7df1e', c2: '#d6be10', txt: '#1a1410' },
    { name: 'Node.js', level: '90%', icon: '🟢', c1: '#43c563', c2: '#1e6f30', txt: '#ffffff' },
    { name: 'RxJS', level: '85%', icon: '💎', c1: '#e10098', c2: '#85005b', txt: '#ffffff' },
    { name: 'Express.js', level: '90%', icon: '🚂', c1: '#888888', c2: '#3a3a3a', txt: '#ffffff' },
    { name: 'MongoDB', level: '85%', icon: '🍃', c1: '#589636', c2: '#2c5d18', txt: '#ffffff' },
    { name: 'SQL Server', level: '85%', icon: '💾', c1: '#e38b00', c2: '#965200', txt: '#ffffff' },
    { name: 'ASP.NET / C#', level: '80%', icon: '💜', c1: '#512bd4', c2: '#311499', txt: '#ffffff' },
    { name: 'REST APIs', level: '95%', icon: '🔌', c1: '#00b4d8', c2: '#006794', txt: '#ffffff' },
    { name: 'WebSockets', level: '90%', icon: '📡', c1: '#7209b7', c2: '#3f37c9', txt: '#ffffff' },
    { name: 'Microservices', level: '85%', icon: '🧩', c1: '#48cae4', c2: '#007bbf', txt: '#ffffff' },
    { name: 'Lazy Loading', level: '90%', icon: '⏳', c1: '#f77f00', c2: '#c91f00', txt: '#ffffff' },
    { name: 'Git & GitHub', level: '95%', icon: '🐙', c1: '#282e38', c2: '#0e1115', txt: '#ffffff' },
    { name: 'Webpack', level: '80%', icon: '📦', c1: '#1c78c0', c2: '#0f4f82', txt: '#ffffff' },
    { name: 'Postman', level: '90%', icon: '🚀', c1: '#ff6c37', c2: '#be3800', txt: '#ffffff' }
  ];

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera;
  private spheres: PhysicsSphere[] = [];
  private frameId = 0;
  private isLightTheme = false;
  private bumpTexture!: THREE.CanvasTexture;

  // Interaction variables
  private mouse = new THREE.Vector2(-9999, -9999);
  private aspect = 1;
  private width3D = 10;
  private height3D = 10;

  constructor(private zone: NgZone) { }

  ngAfterViewInit() {
    this.initThree();
    this.createSpheres();
    this.zone.runOutsideAngular(() => this.animate());
  }

  private initThree() {
    const canvas = this.canvasRef.nativeElement;
    const container = this.containerRef.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = null;

    this.aspect = width / height;
    this.height3D = 5.0;  // Smaller world = bigger balls on screen
    this.width3D = this.height3D * this.aspect;

    this.camera = new THREE.OrthographicCamera(
      -this.width3D / 2, this.width3D / 2,
      this.height3D / 2, -this.height3D / 2,
      0.1, 100
    );
    this.camera.position.set(0, 0, 10);

    this.isLightTheme = document.body.classList.contains('light-theme');

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight.position.set(2, 4, 5);
    this.scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.9);
    backLight.position.set(-2, -4, -2);
    this.scene.add(backLight);
  }

  private createBumpTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Base height
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 256);

    // Dimple heightmap
    const dimpleRadius = 6;
    const spacing = 16;
    for (let y = spacing; y < 256; y += spacing) {
      const shift = (y / spacing) % 2 === 0 ? spacing / 2 : 0;
      for (let x = spacing + shift; x < 512; x += spacing) {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, dimpleRadius);
        grad.addColorStop(0, '#555555'); // Center depression
        grad.addColorStop(0.8, '#d8d8d8');
        grad.addColorStop(1, '#ffffff'); // Flat surface
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, dimpleRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 2.5); // Dense repeats
    return texture;
  }

  private createSpheres() {
    const isSmallScreen = window.innerWidth < 768;
    const r = isSmallScreen ? 0.40 : 0.50; // Larger balls for readable text

    this.bumpTexture = this.createBumpTexture();

    this.skills.forEach((skill, idx) => {
      const texture = this.createBadgeTexture(skill.name, skill.icon, skill.level, skill.c1, skill.c2, skill.txt);

      // Create a 3D Group for billboarding and independent rotation
      const group = new THREE.Group();

      // 1. Create the 3D Sphere (Golf Ball Body)
      const sphereGeometry = new THREE.SphereGeometry(r, 32, 32);
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xf5f5f0, // White/Ivory golf ball color
        roughness: 0.2,
        metalness: 0.05,
        bumpMap: this.bumpTexture,
        bumpScale: 0.06
      });
      const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      group.add(sphereMesh);

      // 2. Create the Curved Label (Tech Stack UI overlay matching sphere curvature)
      const w = r * 1.55;
      const h = r * 1.55;
      const labelGeometry = new THREE.PlaneGeometry(w, h, 16, 16);
      const posAttr = labelGeometry.getAttribute('position') as THREE.BufferAttribute;
      const R = r + 0.008; // slightly larger than r for a clean offset
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        const distSq = x * x + y * y;
        const clampSq = Math.min(distSq, R * R * 0.98);
        const z = Math.sqrt(R * R - clampSq);
        posAttr.setZ(i, z);
      }
      posAttr.needsUpdate = true;
      labelGeometry.computeVertexNormals();

      const labelMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        roughness: 0.3,
        metalness: 0.1,
        depthWrite: false // Prevents z-fighting
      });
      const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
      labelMesh.position.set(0, 0, 0); // Already positioned in 3D by vertex offsets!
      group.add(labelMesh);

      // Initial wide scatter
      const angle = (idx / this.skills.length) * Math.PI * 2;
      const dist = (Math.random() * 3.2) + 0.6;
      group.position.set(
        Math.cos(angle) * dist,
        Math.sin(angle) * dist,
        0
      );

      this.scene.add(group);

      this.spheres.push({
        group,
        sphereMesh,
        labelMesh,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 2.0,
          (Math.random() - 0.5) * 2.0,
          0
        ),
        radius: r
      });
    });
  }

  private createBadgeTexture(name: string, icon: string, level: string, c1: string, c2: string, txt: string): THREE.CanvasTexture {
    const SIZE = 512; // Canvas resolution
    const CX = SIZE / 2;
    const CY = SIZE / 2;
    const canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d')!;

    const isLight = this.isLightTheme;
    const levelVal = parseInt(level.replace('%', ''), 10) / 100;

    // Transparent base — let golf ball dimples show through the ring area
    ctx.clearRect(0, 0, SIZE, SIZE);

    // === Outer progress ring ===
    const ringR = CX - 20;
    ctx.beginPath();
    ctx.arc(CX, CY, ringR, 0, Math.PI * 2);
    ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 22;
    ctx.stroke();

    // Active arc
    ctx.beginPath();
    ctx.arc(CX, CY, ringR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * levelVal);
    ctx.strokeStyle = c1;
    ctx.lineWidth = 22;
    ctx.lineCap = 'round';
    ctx.shadowColor = c1;
    ctx.shadowBlur = isLight ? 0 : 14;
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // === Solid inner disc — fully opaque for max text contrast ===
    const discR = ringR - 18;
    ctx.beginPath();
    ctx.arc(CX, CY, discR, 0, Math.PI * 2);
    ctx.fillStyle = isLight ? '#ffffff' : '#071212';
    ctx.fill();

    // Subtle highlight sheen (top-left)
    const sheen = ctx.createRadialGradient(CX - 60, CY - 60, 0, CX, CY, discR);
    sheen.addColorStop(0, isLight ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.07)');
    sheen.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sheen;
    ctx.fill();

    // Disc border
    ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // === Emoji icon — compact, upper zone ===
    ctx.font = '90px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, CX, CY - 82);

    // === Tech name — HUGE, Arial Black (always available in Canvas2D) ===
    // Auto-shrink for long names
    let fontSize = 68;
    const maxW = discR * 1.7;
    ctx.font = `900 ${fontSize}px Arial, sans-serif`;
    while (ctx.measureText(name).width > maxW && fontSize > 28) {
      fontSize -= 3;
      ctx.font = `900 ${fontSize}px Arial, sans-serif`;
    }
    ctx.fillStyle = isLight ? '#000000' : '#ffffff';
    ctx.shadowColor = isLight ? 'transparent' : 'rgba(0,0,0,0.95)';
    ctx.shadowBlur = isLight ? 0 : 6;
    ctx.shadowOffsetY = 2;
    ctx.fillText(name, CX, CY + 18);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // === Skill level — bold, bright, large ===
    ctx.font = `bold 42px "Courier New", monospace`;
    ctx.fillStyle = isLight ? '#005577' : '#00e5ff';
    ctx.fillText(level, CX, CY + 98);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  onMouseMove(e: MouseEvent) {
    const container = this.containerRef.nativeElement;
    const rect = container.getBoundingClientRect();

    const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const my = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.mouse.set(
      mx * (this.width3D / 2),
      my * (this.height3D / 2)
    );
  }

  onMouseLeave() {
    this.mouse.set(-9999, -9999);
  }

  @HostListener('window:resize')
  onResize() {
    const container = this.containerRef.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.aspect = width / height;
    this.width3D = this.height3D * this.aspect;

    this.camera.left = -this.width3D / 2;
    this.camera.right = this.width3D / 2;
    this.camera.top = this.height3D / 2;
    this.camera.bottom = -this.height3D / 2;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  private updateBadgeTextures() {
    this.spheres.forEach((s, idx) => {
      const skill = this.skills[idx];
      const texture = this.createBadgeTexture(skill.name, skill.icon, skill.level, skill.c1, skill.c2, skill.txt);

      const mat = s.labelMesh.material as THREE.MeshStandardMaterial;
      const oldTexture = mat.map;
      mat.map = texture;
      mat.needsUpdate = true;
      if (oldTexture) oldTexture.dispose();
    });
  }

  private animate = () => {
    this.frameId = requestAnimationFrame(this.animate);

    const dt = 0.016; // approximate frame step
    const gravity = 0.4; // lower pull to allow spacing and floating
    const mouseRadius = 2.0;
    const mousePush = 32.0;

    // Theme checking & dynamic texture rebuilding
    const isLight = document.body.classList.contains('light-theme');
    if (isLight !== this.isLightTheme) {
      this.isLightTheme = isLight;
      this.updateBadgeTextures();
    }

    // Boundary limits
    const limitX = (this.width3D / 2) - 0.2;
    const limitY = (this.height3D / 2) - 0.2;

    // Solve Physics
    this.spheres.forEach((s) => {
      const pos = s.group.position;
      const vel = s.velocity;

      // 1. Gravity toward center
      const toCenter = new THREE.Vector3(0, 0, 0).sub(pos);
      vel.addScaledVector(toCenter, gravity * dt);

      // 2. Mouse Repulsion
      const toMouse = new THREE.Vector3(this.mouse.x, this.mouse.y, 0).sub(pos);
      const mouseDist = toMouse.length();
      if (mouseDist < mouseRadius) {
        const force = (1.0 - mouseDist / mouseRadius) * mousePush;
        vel.addScaledVector(toMouse.normalize().negate(), force * dt);
      }

      // 3. Liquid Floating Noise
      const t = performance.now() * 0.001;
      vel.x += Math.sin(t * 2 + pos.y * 3) * 0.08;
      vel.y += Math.cos(t * 1.8 + pos.x * 3) * 0.08;

      // 4. Update Positions
      pos.addScaledVector(vel, dt);

      // 5. Apply boundary friction
      vel.multiplyScalar(0.985); // low drag for dynamic motion

      // 6. Keep inside the box
      if (pos.x < -limitX + s.radius) {
        pos.x = -limitX + s.radius;
        vel.x *= -0.6;
      }
      if (pos.x > limitX - s.radius) {
        pos.x = limitX - s.radius;
        vel.x *= -0.6;
      }
      if (pos.y < -limitY + s.radius) {
        pos.y = -limitY + s.radius;
        vel.y *= -0.6;
      }
      if (pos.y > limitY - s.radius) {
        pos.y = limitY - s.radius;
        vel.y *= -0.6;
      }

      // 7. Roll/Rotate the 3D golf ball sphere based on its movement velocity!
      s.sphereMesh.rotation.y += vel.x * dt * 2.5;
      s.sphereMesh.rotation.x -= vel.y * dt * 2.5;
    });

    // Solve sphere-to-sphere collisions
    for (let i = 0; i < this.spheres.length; i++) {
      for (let j = i + 1; j < this.spheres.length; j++) {
        const s1 = this.spheres[i];
        const s2 = this.spheres[j];

        const delta = s1.group.position.clone().sub(s2.group.position);
        delta.z = 0; // lock to 2D plane
        const dist = delta.length();
        const minDist = s1.radius + s2.radius;

        if (dist < minDist) {
          const overlap = minDist - dist;
          const dir = delta.normalize();

          // Push apart equally
          s1.group.position.addScaledVector(dir, overlap * 0.5);
          s2.group.position.addScaledVector(dir, -overlap * 0.5);

          // Velocity bounce calculation
          const relVel = s1.velocity.clone().sub(s2.velocity);
          const bounceSpeed = relVel.dot(dir);

          if (bounceSpeed < 0) {
            const impulse = -1.25 * bounceSpeed; // elastic coefficient
            s1.velocity.addScaledVector(dir, impulse * 0.5);
            s2.velocity.addScaledVector(dir, -impulse * 0.5);
          }
        }
      }
    }

    // Volumetric 3D tilt: add a subtle tilt to the label overlays relative to their velocity
    this.spheres.forEach((s) => {
      const tiltX = s.velocity.y * 0.05;
      const tiltY = -s.velocity.x * 0.05;
      s.labelMesh.rotation.set(tiltX, tiltY, 0);
    });

    this.renderer.render(this.scene, this.camera);
  };

  @HostListener('window:skills-boom')
  onSkillsBoom() {
    this.spheres.forEach((s) => {
      const pos = s.group.position;
      const dir = pos.clone().normalize();
      if (pos.length() < 0.1) {
        dir.set((Math.random() - 0.5), (Math.random() - 0.5), 0).normalize();
      }
      const speed = 2.6 + Math.random() * 1.6;
      s.velocity.copy(dir).multiplyScalar(speed);
    });
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.frameId);
    this.renderer?.dispose();
    if (this.bumpTexture) this.bumpTexture.dispose();
    this.spheres.forEach((s) => {
      if (s.sphereMesh.geometry) s.sphereMesh.geometry.dispose();
      if (s.sphereMesh.material) {
        const mat = s.sphereMesh.material as THREE.MeshStandardMaterial;
        mat.dispose();
      }
      if (s.labelMesh.geometry) s.labelMesh.geometry.dispose();
      if (s.labelMesh.material) {
        const mat = s.labelMesh.material as THREE.MeshStandardMaterial;
        if (mat.map) mat.map.dispose();
        mat.dispose();
      }
    });
  }
}

