import {
  Component, HostListener, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './components/nav/nav.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ExperienceComponent } from './components/experience.component';
import { EducationComponent } from './components/education.component';
import { ContactComponent } from './components/contact/contact.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { SceneComponent } from './components/scene/scene.component';
import { ScrollService } from './services/scroll.service';
import { MazeComponent } from './components/maze/maze.component';
import { GitStatsComponent } from './components/git-stats/git-stats.component';
import { gsap } from 'gsap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, NavComponent, HeroComponent, AboutComponent,
    ProjectsComponent, SkillsComponent, ExperienceComponent,
    EducationComponent, ContactComponent, ChatbotComponent, SceneComponent,
    MazeComponent, GitStatsComponent
  ],
  template: `
    <!-- Interactive Cyberpunk Recruiter Bypass Loader Overlay -->
    <div class="cyber-loader" *ngIf="!isLoaded" [class.fade-out]="isFadingOut" [class.glitching]="isGlitching">
      <div class="loader-bg-grid" *ngIf="gameMode === 'none'"></div>
      <div class="loader-scanline" *ngIf="gameMode === 'none'"></div>

      <!-- Maze Game Component -->
      <app-maze *ngIf="gameMode === 'maze'" (exit)="exitGameToPortfolio()"></app-maze>
      
      <div class="terminal-container" *ngIf="gameMode === 'none'">
        <!-- Terminal Header -->
        <div class="term-header">
          <div class="term-dots">
            <span class="term-dot red"></span>
            <span class="term-dot yellow"></span>
            <span class="term-dot green"></span>
          </div>
          <span class="term-title">SHIVAM_OS_TERMINAL - v4.1.0</span>
          <span class="term-status">RECRUITER_SESSION</span>
        </div>

        <!-- Terminal Body -->
        <div class="term-body" #termBody>
          <div class="log-stream">
            <div class="log-line" *ngFor="let log of logList" [innerHTML]="log"></div>
          </div>

          <!-- Hacker Type Stream -->
          <div class="hacker-stream" *ngIf="hackerLines.length > 0">
            <div class="hack-line" *ngFor="let line of hackerLines">>>> {{ line }}</div>
          </div>

          <!-- Blinking prompt -->
          <div class="log-line prompt" *ngIf="showPrompt && !showGameChoice">
            <span class="cursor-prefix">root&#64;shivam_os:~$</span>
            <span class="blinking-cursor">█</span>
          </div>

          <!-- Warning Box & Bypass CTA -->
          <div class="locked-alert" *ngIf="showBypass && !showGameChoice" [class.glitch-flash]="isGlitching">
            <div class="alert-box">
              <span class="alert-icon">⚠️</span>
              <div class="alert-msg">
                <span class="red-glow">FIREWALL SYSTEM ENGAGED</span>
                <span class="micro-info">TYPE ANY KEYS ON KEYBOARD TO HACK OR INITIATE MANUAL BYPASS</span>
              </div>
            </div>
            
            <button 
              class="bypass-btn" 
              (click)="onBypassClick()" 
              (mouseenter)="playSynthSound('hover')"
              #bypassBtn>
              <span class="btn-glitch-bg"></span>
              <span class="btn-text">INITIATE SECURITY BYPASS</span>
            </button>
          </div>

          <!-- Choice box inside Terminal Body -->
          <div class="locked-alert choice-panel" *ngIf="showGameChoice" style="border-top: 1px dashed rgba(0, 245, 170, 0.25); animation: alertFadeIn 0.5s ease-out forwards; width: 100%;">
            <div class="alert-box choice-box" style="background: rgba(0, 245, 170, 0.06); border-color: rgba(0, 245, 170, 0.3);">
              <span class="alert-icon">⚡</span>
              <div class="alert-msg">
                <span class="red-glow" style="color: #00f5aa; text-shadow: 0 0 8px rgba(0, 245, 170, 0.4);">OVERRIDE SUCCESSFUL</span>
                <span class="micro-info" style="color: rgba(255, 255, 255, 0.5);">Systems decrypted. Select initialization routine:</span>
              </div>
            </div>
            
            <div class="choice-actions" style="display: flex; gap: 1rem; width: 100%; margin-top: 0.5rem;">
              <button 
                class="bypass-btn play-btn" 
                (click)="startMaze()"
                (mouseenter)="playSynthSound('hover')"
                style="flex: 1;">
                PLAY MAZE PROTOCOL
              </button>
              <button 
                class="bypass-btn skip-btn" 
                (click)="exitGameToPortfolio()"
                (mouseenter)="playSynthSound('hover')"
                style="flex: 1; border-color: var(--pink); color: var(--pink); box-shadow: 0 0 15px rgba(236, 72, 153, 0.15);">
                DIRECT PORTFOLIO
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dev Console Slide-Down Drawer -->
    <div class="dev-console" [class.open]="isConsoleOpen">
      <div class="console-header">
        <span class="console-title">> SHIVAM_OS_CONSOLE</span>
        <span class="console-hint">(Press \` to toggle)</span>
      </div>
      <div class="console-output" #consoleOutput>
        <div class="console-line" *ngFor="let line of consoleLogs" [innerHTML]="line"></div>
      </div>
      <div class="console-input-row">
        <span class="console-prompt">shivam_os#</span>
        <input 
          type="text" 
          class="console-input" 
          (keydown.enter)="executeConsoleCommand(consoleInputEl.value); consoleInputEl.value = ''" 
          #consoleInputEl>
      </div>
    </div>

    <app-scene></app-scene>
    <!-- Global background orbs for Apple glassmorphic look -->
    <div class="global-orb orb-1" aria-hidden="true"></div>
    <div class="global-orb orb-2" aria-hidden="true"></div>
    <div class="global-orb orb-3" aria-hidden="true"></div>

    <div id="cursor-dot"></div>
    <div id="cursor-ring"></div>

    <app-nav></app-nav>
    
    <div class="carousel-container">
      <div class="carousel-wrapper">
        <app-hero class="carousel-slide" [class.active]="activePage === 0"></app-hero>
        <app-about class="carousel-slide" [class.active]="activePage === 1"></app-about>
        <app-skills class="carousel-slide" [class.active]="activePage === 2"></app-skills>
        <app-projects class="carousel-slide" [class.active]="activePage === 3"></app-projects>
        <app-experience class="carousel-slide" [class.active]="activePage === 4"></app-experience>
        <app-education class="carousel-slide" [class.active]="activePage === 5"></app-education>
        
        <app-git-stats class="carousel-slide" [class.active]="activePage === 6"></app-git-stats>
        
        <div id="contact-slide" class="carousel-slide" [class.active]="activePage === 7" style="display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; padding-top: 65px; box-sizing: border-box; height: 100vh; background: #000000;">
          <app-contact style="display: flex; align-items: center; justify-content: center; flex: 1; min-height: 0; overflow: hidden; width: 100%;"></app-contact>
          <!-- Premium Footer inside Contact slide -->
          <footer class="site-footer">
            <div class="footer-grid-layout">
              <!-- Left Column: Tagline -->
              <div class="footer-grid-col left-col">
                <p class="footer-tagline">Scaling ideas<br>into products.</p>
              </div>

              <!-- Center Column: Static Name -->
              <div class="footer-grid-col center-col">
                <span class="footer-big-name">SHIVAM</span>
              </div>

              <!-- Right Column: Quick Links & Contact -->
              <div class="footer-grid-col right-col">
                <div class="footer-links">
                  <div class="footer-col">
                    <span class="footer-col-title">QUICK LINKS</span>
                    <a href="#hero" class="footer-link">Home</a>
                    <a href="#about" class="footer-link">About Me</a>
                    <a href="#experience" class="footer-link">Work</a>
                    <a href="#contact" class="footer-link">Contact</a>
                  </div>
                  <div class="footer-col">
                    <span class="footer-col-title">CONTACTS</span>
                    <a href="mailto:arjundivaker8@gmail.com" class="footer-link">arjundivaker8&#64;gmail.com</a>
                    <a href="https://github.com/Div-404" target="_blank" class="footer-link">GitHub ↗</a>
                    <a href="https://linkedin.com/in/shivam-kumar-divakar-30b567137" target="_blank" class="footer-link">LinkedIn ↗</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="footer-bottom">
              <span>&copy; 2026 Shivam Kumar Divaker. All rights reserved.</span>
              <span>Built with Angular &amp; Three.js</span>
            </div>
            <div class="footer-skills-marquee">
              <div class="skills-marquee-track">
                <span class="marquee-item">
                  TypeScript <span class="bullet">✦</span> Node.js <span class="bullet">✦</span> RxJS <span class="bullet">✦</span> SCSS <span class="bullet">✦</span> MongoDB <span class="bullet">✦</span> Express <span class="bullet">✦</span> WebSockets <span class="bullet">✦</span> REST APIs <span class="bullet">✦</span> APIs <span class="bullet">✦</span> Git <span class="bullet">✦</span> Angular <span class="bullet">✦</span> SQL Server <span class="bullet">✦</span>
                </span>
                <span class="marquee-item" aria-hidden="true">
                  TypeScript <span class="bullet">✦</span> Node.js <span class="bullet">✦</span> RxJS <span class="bullet">✦</span> SCSS <span class="bullet">✦</span> MongoDB <span class="bullet">✦</span> Express <span class="bullet">✦</span> WebSockets <span class="bullet">✦</span> REST APIs <span class="bullet">✦</span> APIs <span class="bullet">✦</span> Git <span class="bullet">✦</span> Angular <span class="bullet">✦</span> SQL Server <span class="bullet">✦</span>
                </span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>

    <!-- Page indicator dots -->
    <div class="carousel-dots">
      <button 
        *ngFor="let page of pages; let i = index" 
        [class.active]="i === activePage" 
        (click)="goToPage(i)"
        [title]="page.name"
        [attr.aria-label]="'Go to ' + page.name">
        <span class="dot-label">{{ page.name }}</span>
      </button>
    </div>

    <!-- Active AI Chatbot -->
    <app-chatbot></app-chatbot>
  `,
  styles: [`
    .site-footer {
      width: 100%;
      flex-shrink: 0;
      background: rgba(22, 22, 23, 0.45);
      backdrop-filter: blur(24px) saturate(180%);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
      padding: 2.4rem 2rem 28px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      font-family: 'IBM Plex Sans', sans-serif;
      position: relative;
      z-index: 10000;
    }
    .footer-grid-layout {
      display: grid;
      grid-template-columns: 1.2fr 1.6fr 1.6fr;
      gap: 1rem;
      align-items: center;
      margin-bottom: 0.3rem;
    }
    .footer-grid-col {
      display: flex;
      flex-direction: column;
    }
    .footer-grid-col.left-col {
      align-items: flex-start;
    }
    .footer-grid-col.center-col {
      align-items: center;
      justify-content: center;
    }
    .footer-grid-col.right-col {
      align-items: flex-end;
    }
    .footer-tagline {
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: clamp(1.8rem, 3.2vw, 2.3rem);
      font-weight: 400;
      color: #ffffff;
      line-height: 1.15;
      margin: 0;
      letter-spacing: -0.01em;
    }
    .footer-links {
      display: flex;
      gap: 3rem;
    }
    .footer-col {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .footer-col-title {
      font-size: 0.65rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.4);
      letter-spacing: 0.1em;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      font-family: var(--font-m);
    }
    .footer-link {
      font-size: 0.72rem;
      color: rgba(255,255,255,0.4);
      text-decoration: none;
      letter-spacing: 0.05em;
      transition: color 0.2s;
    }
    .footer-link:hover { color: var(--cyan); }
    
    .footer-big-name {
      font-family: 'Unbounded', sans-serif;
      font-size: clamp(2rem, 5.5vw, 4.5rem);
      font-weight: 900;
      color: transparent;
      -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.06);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      text-align: center;
      line-height: 1;
      display: block;
      white-space: nowrap;
    }
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.25rem 0;
      border-top: 1px solid rgba(255,255,255,0.05);
      font-size: 0.65rem;
      color: rgba(255,255,255,0.25);
      letter-spacing: 0.06em;
    }
    
    /* Skills marquee at the absolute bottom */
    .footer-skills-marquee {
      overflow: hidden;
      width: 100vw;
      margin-left: calc(-50vw + 50%);
      background: rgba(0, 0, 0, 0.15);
      padding: 0.35rem 0;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      white-space: nowrap;
      pointer-events: none;
      user-select: none;
    }
    .skills-marquee-track {
      display: inline-flex;
      white-space: nowrap;
      animation: skillsMarquee 30s linear infinite;
    }
    .marquee-item {
      font-family: var(--font-m);
      font-size: 0.68rem;
      color: #86868b;
      letter-spacing: 0.08em;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding-right: 1.5rem;
    }
    .marquee-item .bullet {
      color: #00d4ff;
      opacity: 0.7;
    }
    @keyframes skillsMarquee {
      0% { transform: translate3d(0, 0, 0); }
      100% { transform: translate3d(-50%, 0, 0); }
    }
    #contact-slide::-webkit-scrollbar {
      display: none !important;
    }
  `]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  progress = 0;
  isLoaded = false;
  isFadingOut = false;
  isGlitching = false;
  showPrompt = false;
  showBypass = false;
  gltfLoaded = false;

  logList: string[] = [];
  rawLogs = [
    'SYS_BOOT: MOUNTING SYSTEM PARTITION & READING CONFIGS...',
    'DIAGNOSTICS: MEMORY UNIT STATUS [4+ YEARS EXP]... <span class="green-glow">OK</span>',
    'DIAGNOSTICS: CORE DEVELOPER CPU [16 THREADS]... <span class="green-glow">OK</span>',
    'NET_EST: TUNNELING SSH PROTOCOL ON SECURE PORT 63053...',
    'ASSET_ING: FETCHING BlueSuitMan.glb 3D AVATAR MESH...',
    'GPU_INIT: COMPILING CUSTOM COMPOSITE WEBGL SHADERS...',
    'SYSTEM: ACTIVE RECRUITER CHANNEL DETECTED.'
  ];

  hackerLines: string[] = [];
  hackerCodeTemplates = [
    '#include <shivam_portfolio.h>',
    'void executeRecruiterBypass() {',
    '  System::Kernel::LockOverride(true);',
    '  Network::PortSecure::TunnelSsh(63053);',
    '  std::cout << "[SUCCESS] FIREWALL DECRYPTED..." << std::endl;',
    '}',
    '#define BYPASS_KEY 0xFA4C9B27',
    'int decryptHandshake() {',
    '  auto cipher = MatrixCode::ScanlineRain();',
    '  return cipher.decrypt(BYPASS_KEY);',
    '}'
  ];
  hackerTemplateIndex = 0;
  
  private logTimeout: any;

  @ViewChild('termBody') termBody!: ElementRef<HTMLDivElement>;

  // Dev Console Properties
  isConsoleOpen = false;
  consoleInputVal = '';
  consoleLogs: string[] = [
    'System DevConsole active. Type "help" for a list of control overrides.'
  ];

  @ViewChild('consoleOutput') consoleOutput!: ElementRef<HTMLDivElement>;
  @ViewChild('consoleInputEl') consoleInputEl!: ElementRef<HTMLInputElement>;

  ngOnInit() {
    document.body.classList.add('js-loaded');
    this.startLoaderSimulation();

    this.scrollService.activePage$.subscribe(page => {
      if (page !== this.activePage) {
        this.goToPage(page);
      }
    });

    // Bind F12 browser console globals
    (window as any).hire = () => {
      this.goToPage(6);
      console.log('%c[SYSTEM] Navigating to contact form page...', 'color: #00d4ff; font-weight: bold;');
      return 'Bypassing coordinates to Contact Form...';
    };
    (window as any).skills = () => {
      this.goToPage(2);
      console.log('%c[SYSTEM] Navigating to Skills section...', 'color: #00d4ff; font-weight: bold;');
      return 'Bypassing coordinates to Skills Area...';
    };
    (window as any).theme = () => {
      const themeBtn = document.querySelector('.theme-toggle-btn') as HTMLButtonElement;
      if (themeBtn) themeBtn.click();
      return 'Toggled environment lights!';
    };
    (window as any).skillsBoom = () => {
      window.dispatchEvent(new CustomEvent('skills-boom'));
      return 'Skills physics spheres exploded!';
    };
    (window as any).avatarShake = () => {
      window.dispatchEvent(new CustomEvent('avatar-shake'));
      return 'Avatar holographic shader glitched!';
    };

    console.log(
      `%c
   ____  _     _                 
  / ___|| |__ (_)_   ____ _ _ __ ___  
  \\___ \\| '_ \\| \\ \\ / / _\` | '_ \` _ \\ 
   ___) | | | | |\\ V / (_| | | | | | |
  |____/|_| |_|_| \\_/ \\__,_|_| |_| |_|
                                      
  🔥 Welcome Developer Recruiter! 🔥
  Inspecting Shivam's code? You've found the control panel!
  Try running these JS commands directly in this console:
    > hire()
    > skills()
    > theme()
    > skillsBoom()
    > avatarShake()
  Or press the backtick/tilde (\`) key on the page to open the in-game developer terminal!
  `,
      'color: #ec4899; font-weight: bold; font-family: monospace; line-height: 1.4;'
    );
  }

  playSynthSound(type: 'hover' | 'click' | 'keypress' | 'glitch') {
    try {
      const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext);
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (type === 'hover') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'keypress') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(250 + Math.random() * 180, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.6);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.65);
      } else if (type === 'glitch') {
        const bufferSize = ctx.sampleRate * 0.25;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
      }
    } catch (e) {}
  }

  scrollToBottom() {
    setTimeout(() => {
      try {
        if (this.termBody) {
          this.termBody.nativeElement.scrollTop = this.termBody.nativeElement.scrollHeight;
        }
      } catch (err) {}
    }, 50);
  }

  startLoaderSimulation() {
    let logIdx = 0;
    const printLog = () => {
      if (logIdx < this.rawLogs.length) {
        this.logList.push(this.rawLogs[logIdx]);
        this.playSynthSound('keypress');
        this.progress = Math.round((logIdx / this.rawLogs.length) * 90);
        this.scrollToBottom();
        logIdx++;
        this.logTimeout = setTimeout(printLog, 250 + Math.random() * 150);
      } else {
        this.showPrompt = true;
        this.logTimeout = setTimeout(() => {
          this.showBypass = true;
          this.playSynthSound('hover');
          this.scrollToBottom();
        }, 300);
      }
    };
    this.logTimeout = setTimeout(printLog, 150);
  }

  completeLogsInstantly() {
    if (this.logTimeout) {
      clearTimeout(this.logTimeout);
    }
    this.logList = [...this.rawLogs];
    this.showPrompt = true;
    this.showBypass = true;
    this.progress = 90;
    this.playSynthSound('click');
    this.scrollToBottom();
  }

  toggleConsole() {
    this.isConsoleOpen = !this.isConsoleOpen;
    this.playSynthSound('click');
    if (this.isConsoleOpen) {
      setTimeout(() => {
        if (this.consoleInputEl) {
          this.consoleInputEl.nativeElement.focus();
        }
      }, 100);
    }
  }

  executeConsoleCommand(cmd: string) {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    this.consoleLogs.push(`<span class="prompt-line">shivam_os# ${cmd}</span>`);
    this.playSynthSound('keypress');

    switch (trimmed) {
      case 'help':
        this.consoleLogs.push(
          'Available commands:',
          '  <span class="cyan-glow">skills-boom</span>   - Triggers a physics explosion in the skills sphere cloud.',
          '  <span class="cyan-glow">avatar-shake</span>  - Spikes the shader displacement on the 3D model.',
          '  <span class="cyan-glow">theme-swap</span>   - Toggles Day/Night mode colors and lighting.',
          '  <span class="cyan-glow">contact</span>      - Navigates directly to the contact page.',
          '  <span class="cyan-glow">clear</span>         - Clears the console screen.'
        );
        break;
      case 'skills-boom':
        this.consoleLogs.push('<span class="green-glow">Executing Skills Boom Protocol... Particle velocity vectors spiked!</span>');
        window.dispatchEvent(new CustomEvent('skills-boom'));
        this.playSynthSound('glitch');
        break;
      case 'avatar-shake':
        this.consoleLogs.push('<span class="green-glow">Executing Avatar Glitch Shake... Hologram displacement active!</span>');
        window.dispatchEvent(new CustomEvent('avatar-shake'));
        this.playSynthSound('glitch');
        break;
      case 'theme-swap':
        this.consoleLogs.push('<span class="green-glow">Toggling environment light systems...</span>');
        const themeBtn = document.querySelector('.theme-toggle-btn') as HTMLButtonElement;
        if (themeBtn) {
          themeBtn.click();
        }
        break;
      case 'contact':
        this.consoleLogs.push('<span class="green-glow">Snapping camera coordinate systems to Contact Slide...</span>');
        this.goToPage(6);
        break;
      case 'clear':
        this.consoleLogs = ['Console screen cleared.'];
        break;
      default:
        this.consoleLogs.push(`<span class="red-glow">Command not found: "${trimmed}". Type "help" for instructions.</span>`);
        this.playSynthSound('glitch');
        break;
    }

    setTimeout(() => {
      try {
        if (this.consoleOutput) {
          this.consoleOutput.nativeElement.scrollTop = this.consoleOutput.nativeElement.scrollHeight;
        }
      } catch (err) {}
    }, 50);
  }

  @HostListener('window:keydown', ['$event'])
  onLoaderKeyDown(e: KeyboardEvent) {
    // 1. Check for DevConsole Toggle (backtick key ` or ~)
    if (e.key === '`') {
      e.preventDefault();
      this.toggleConsole();
      return;
    }

    // 2. If console is open, do not execute loader actions
    if (this.isConsoleOpen) return;

    // 3. Prevent scroll on space/arrows during loader phase
    if (!this.isLoaded && (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
    }

    // 4. Skip if loader is already dismissed
    if (this.isLoaded) return;

    // Skip logs compilation instantly on first key hit
    if (!this.showBypass) {
      this.completeLogsInstantly();
      return;
    }

    // Capture standard letters to print code snippets
    if (e.key.length === 1) {
      this.playSynthSound('keypress');
      if (this.hackerTemplateIndex < this.hackerCodeTemplates.length) {
        this.hackerLines.push(this.hackerCodeTemplates[this.hackerTemplateIndex]);
        this.hackerTemplateIndex++;
        this.progress = 90 + Math.round((this.hackerTemplateIndex / this.hackerCodeTemplates.length) * 7);
        this.scrollToBottom();
      } else {
        this.onBypassClick();
      }
    }
  }

  @HostListener('window:gltf-loaded')
  onGltfLoaded() {
    this.gltfLoaded = true;
  }

  @HostListener('window:synth-sound', ['$event'])
  onSynthSound(e: any) {
    if (e.detail && e.detail.sound) {
      this.playSynthSound(e.detail.sound);
    }
  }

  showGameChoice = false;
  gameMode: 'none' | 'maze' = 'none';

  onBypassClick() {
    if (this.isGlitching) return;
    this.isGlitching = true;
    this.playSynthSound('click');
    
    setTimeout(() => this.playSynthSound('glitch'), 150);
    setTimeout(() => this.playSynthSound('glitch'), 350);

    const checkGltfReady = () => {
      if (this.gltfLoaded) {
        this.progress = 100;
        this.scrollToBottom();
        
        // Show choice panel instead of fading out
        setTimeout(() => {
          this.isGlitching = false;
          this.showGameChoice = true;
          this.scrollToBottom();
        }, 500);
      } else {
        if (!this.logList.includes('<span class="red-glow">>>> WAITING FOR 3D ASSET ENGINE PIPELINE...</span>')) {
          this.logList.push('<span class="red-glow">>>> WAITING FOR 3D ASSET ENGINE PIPELINE...</span>');
          this.scrollToBottom();
        }
        setTimeout(checkGltfReady, 250);
      }
    };
    checkGltfReady();
  }

  startMaze() {
    this.gameMode = 'maze';
    this.playSynthSound('click');
    setTimeout(() => this.playSynthSound('hover'), 150);
  }

  exitGameToPortfolio() {
    this.showGameChoice = false;
    this.gameMode = 'none';
    
    this.isFadingOut = true;
    setTimeout(() => {
      this.isLoaded = true;
    }, 850);
  }

  activePage = 0;
  isTransitioning = false;
  pages = [
    { name: 'Hero', id: 'hero' },
    { name: 'About', id: 'about' },
    { name: 'Skills', id: 'skills' },
    { name: 'Projects', id: 'projects' },
    { name: 'Experience', id: 'experience' },
    { name: 'Education', id: 'education' },
    { name: 'Git Stats', id: 'git-stats' },
    { name: 'Contact', id: 'contact-slide' }
  ];

  private touchStartY = 0;
  private currentScrollTween: gsap.core.Tween | null = null;
  private activeTimeline: gsap.core.Timeline | null = null;
  private activeCard: HTMLElement | null = null;

  // Wheel gesture tracking to prevent scroll-skipping
  private wheelTimeout: any = null;
  private isWheelActive = false;
  private hasSwitchedInGesture = false;

  // quickTo setters for cursor follower
  private ringXTo?: Function;
  private ringYTo?: Function;
  private dotXTo?: Function;
  private dotYTo?: Function;

  constructor(private scrollService: ScrollService) { }

  splitTextSafely(element: HTMLElement) {
    if (!element) return;
    
    const processNode = (node: Node): Node[] => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        // If it's pure whitespace and contains spaces, preserve it as a space char
        if (!text.trim() && text.includes(' ')) {
          const spaceSpan = document.createElement('span');
          spaceSpan.className = 'char space';
          spaceSpan.innerHTML = '&nbsp;';
          return [spaceSpan];
        }
        
        const words = text.split(/(\s+)/);
        const newNodes: Node[] = [];
        
        words.forEach(wordText => {
          if (!wordText) return;
          if (/^\s+$/.test(wordText)) {
            const spaceSpan = document.createElement('span');
            spaceSpan.className = 'char space';
            spaceSpan.innerHTML = '&nbsp;';
            newNodes.push(spaceSpan);
          } else {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            
            for (let i = 0; i < wordText.length; i++) {
              const charSpan = document.createElement('span');
              charSpan.className = 'char';
              charSpan.textContent = wordText[i];
              wordSpan.appendChild(charSpan);
            }
            newNodes.push(wordSpan);
          }
        });
        return newNodes;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        if (el.classList.contains('char') || el.classList.contains('word')) {
          return [el];
        }
        if (el.tagName.toLowerCase() === 'br') {
          return [el];
        }
        const childNodesArray = Array.from(el.childNodes);
        el.innerHTML = '';
        childNodesArray.forEach(child => {
          const processed = processNode(child);
          processed.forEach(newChild => el.appendChild(newChild));
        });
        return [el];
      }
      return [node];
    };

    const originalChildren = Array.from(element.childNodes);
    element.innerHTML = '';
    originalChildren.forEach(child => {
      const processed = processNode(child);
      processed.forEach(newChild => element.appendChild(newChild));
    });
  }



  ngAfterViewInit() {
    window.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('touchstart', this.onTouchStart, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: false });
    window.addEventListener('touchend', this.onTouchEnd, { passive: true });

    // Dynamic recursive text splitting for premium staggered letter/word reveals
    const splitElements = document.querySelectorAll(
      '.section-label, .section-h2, .hero-eyebrow, .hero-sub, .about-text p, .edu-intro, .contact-title'
    );
    splitElements.forEach(el => {
      this.splitTextSafely(el as HTMLElement);
    });

    // Initialize quickTo for cursor follower (will-change and GPU transform acceleration)
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (dot) {
      gsap.set(dot, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });
      this.dotXTo = gsap.quickTo(dot, "x", { duration: 0.05, ease: "power3.out" });
      this.dotYTo = gsap.quickTo(dot, "y", { duration: 0.05, ease: "power3.out" });
    }
    if (ring) {
      gsap.set(ring, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });
      this.ringXTo = gsap.quickTo(ring, "x", { duration: 0.25, ease: "power3.out" });
      this.ringYTo = gsap.quickTo(ring, "y", { duration: 0.25, ease: "power3.out" });
    }

    // Set initial state for Hero slide to hidden and trigger animation
    const heroSlide = document.querySelectorAll('.carousel-slide')[0] as HTMLElement;
    if (heroSlide) {
      const animatable = heroSlide.querySelectorAll(
        '.hero-eyebrow .char, .hero-h1 .char, .hero-sub .word, .hero-actions a, .float-chip'
      );
      if (animatable.length > 0) {
        gsap.set(animatable, { opacity: 0, y: 20 });
      }
    }
    setTimeout(() => {
      this.animateActiveSlideText(0);
    }, 200);
  }

  ngOnDestroy() {
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
    if (this.currentScrollTween) {
      this.currentScrollTween.kill();
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (this.dotXTo && this.dotYTo) {
      this.dotXTo(e.clientX);
      this.dotYTo(e.clientY);
    } else {
      const dot = document.getElementById('cursor-dot');
      if (dot) {
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
      }
    }

    if (this.ringXTo && this.ringYTo) {
      this.ringXTo(e.clientX);
      this.ringYTo(e.clientY);
    } else {
      const ring = document.getElementById('cursor-ring');
      if (ring) {
        ring.animate({
          left: `${e.clientX}px`,
          top: `${e.clientY}px`
        }, { duration: 150, fill: 'forwards' });
      }
    }

    // 3D card tilt event delegation
    const target = e.target as HTMLElement;
    const card = target.closest('.project-card, .exp-card, .edu-card, .glass-card, .course-card, .repo-card') as HTMLElement;

    if (card) {
      if (this.activeCard && this.activeCard !== card) {
        this.resetCard(this.activeCard);
      }
      this.activeCard = card;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateY = (x / rect.width - 0.5) * 10;
      const rotateX = (y / rect.height - 0.5) * -10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      card.style.transition = 'transform 0.1s ease';
    } else if (this.activeCard) {
      this.resetCard(this.activeCard);
      this.activeCard = null;
    }
  }

  private resetCard(card: HTMLElement) {
    card.style.transform = 'translateY(0) scale(1)';
    card.style.transition = 'transform 0.5s ease';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor) {
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        let index = this.pages.findIndex(p => p.id === targetId);
        if (targetId === 'contact' && index === -1) {
          index = this.pages.findIndex(p => p.id === 'contact-slide');
        }
        if (index !== -1) {
          this.goToPage(index);
        }
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    const activeSection = this.getSectionElement(this.activePage);
    if (activeSection) {
      const style = window.getComputedStyle(activeSection);
      const canScrollY = style.overflowY === 'auto' || style.overflowY === 'scroll';
      const isScrollable = canScrollY && (activeSection.scrollHeight - activeSection.clientHeight > 50);
      if (isScrollable) {
        const atTop = activeSection.scrollTop <= 0;
        const atBottom = activeSection.scrollTop + activeSection.clientHeight >= activeSection.scrollHeight - 1;

        if ((e.key === 'ArrowUp' || e.key === 'PageUp') && !atTop) return;
        if ((e.key === 'ArrowDown' || e.key === 'PageDown') && !atBottom) return;
      }
    }

    if (this.isTransitioning) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      this.nextPage();
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      this.prevPage();
    } else if (e.key === 'Home') {
      e.preventDefault();
      this.goToPage(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      this.goToPage(this.pages.length - 1);
    }
  }

  onWheel = (e: WheelEvent) => {
    const activeSection = this.getSectionElement(this.activePage);
    if (activeSection) {
      const style = window.getComputedStyle(activeSection);
      const canScrollY = style.overflowY === 'auto' || style.overflowY === 'scroll';
      const isScrollable = canScrollY && (activeSection.scrollHeight - activeSection.clientHeight > 50);
      if (isScrollable) {
        const atTop = activeSection.scrollTop <= 0;
        const atBottom = activeSection.scrollTop + activeSection.clientHeight >= activeSection.scrollHeight - 1;

        if (e.deltaY < 0 && !atTop) return;
        if (e.deltaY > 0 && !atBottom) return;
      }
    }

    e.preventDefault();

    // Start/maintain gesture state
    if (!this.isWheelActive) {
      this.isWheelActive = true;
      this.hasSwitchedInGesture = false;
    }

    // Debounce to detect end of wheel gesture
    if (this.wheelTimeout) {
      clearTimeout(this.wheelTimeout);
    }
    this.wheelTimeout = setTimeout(() => {
      this.isWheelActive = false;
      this.hasSwitchedInGesture = false;
    }, 150);

    // Reject very small values to ignore mouse-inertia tremors
    if (Math.abs(e.deltaY) < 15) {
      return;
    }

    // If transition is in progress or we switched page in this gesture, ignore
    if (this.isTransitioning || this.hasSwitchedInGesture) {
      return;
    }

    if (e.deltaY > 0) {
      this.hasSwitchedInGesture = true;
      this.nextPage();
    } else if (e.deltaY < 0) {
      this.hasSwitchedInGesture = true;
      this.prevPage();
    }
  };

  onTouchStart = (e: TouchEvent) => {
    this.touchStartY = e.touches[0].clientY;
  };

  onTouchMove = (e: TouchEvent) => {
    const touchCurrentY = e.touches[0].clientY;
    const deltaY = this.touchStartY - touchCurrentY;

    const activeSection = this.getSectionElement(this.activePage);
    if (activeSection) {
      const style = window.getComputedStyle(activeSection);
      const canScrollY = style.overflowY === 'auto' || style.overflowY === 'scroll';
      const isScrollable = canScrollY && (activeSection.scrollHeight - activeSection.clientHeight > 50);
      if (isScrollable) {
        const atTop = activeSection.scrollTop <= 0;
        const atBottom = activeSection.scrollTop + activeSection.clientHeight >= activeSection.scrollHeight - 1;

        if (deltaY < 0 && !atTop) return;
        if (deltaY > 0 && !atBottom) return;
      }
    }

    e.preventDefault();
  };

  onTouchEnd = (e: TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = this.touchStartY - touchEndY;

    if (Math.abs(deltaY) < 50) return;

    const activeSection = this.getSectionElement(this.activePage);
    if (activeSection) {
      const style = window.getComputedStyle(activeSection);
      const canScrollY = style.overflowY === 'auto' || style.overflowY === 'scroll';
      const isScrollable = canScrollY && (activeSection.scrollHeight - activeSection.clientHeight > 50);
      if (isScrollable) {
        const atTop = activeSection.scrollTop <= 0;
        const atBottom = activeSection.scrollTop + activeSection.clientHeight >= activeSection.scrollHeight - 1;

        if (deltaY < 0 && !atTop) return;
        if (deltaY > 0 && !atBottom) return;
      }
    }

    if (this.isTransitioning) return;

    if (deltaY > 0) {
      this.nextPage();
    } else {
      this.prevPage();
    }
  };

  nextPage() {
    if (this.activePage < this.pages.length - 1) {
      this.goToPage(this.activePage + 1);
    }
  }

  prevPage() {
    if (this.activePage > 0) {
      this.goToPage(this.activePage - 1);
    }
  }

  goToPage(pageIndex: number) {
    if (pageIndex < 0 || pageIndex >= this.pages.length) return;
    this.isTransitioning = true;

    const fromY = this.scrollService.getVirtualScrollY();
    const toY = pageIndex * window.innerHeight;

    if (this.activeTimeline) {
      this.activeTimeline.kill();
    }

    this.activePage = pageIndex;
    this.scrollService.setActivePage(pageIndex);

    // Instantly hide the entering page elements to avoid FOUC.
    // Target child characters/words/links directly to keep parent containers visible.
    const enteringSlide = document.querySelectorAll('.carousel-slide')[pageIndex] as HTMLElement;
    if (enteringSlide) {
      const animatable = enteringSlide.querySelectorAll(
        '.section-label .char, .section-h2 .char, .hero-eyebrow .char, .hero-h1 .char, .hero-sub .word, ' +
        '.hero-actions a, .about-text p .word, .about-stats .stat, .skills-container, .project-card, .exp-item, ' +
        '.edu-intro .word, .edu-stat, .edu-card, .git-card, .contact-title .char, .terminal-window, .contact-ctas a, .contact-ctas button, .float-chip, .terminal-body p'
      );
      if (animatable.length > 0) {
        gsap.set(animatable, { opacity: 0, y: 20 });
      }
    }

    // Clear GSAP inline styles on other slides so they reset to CSS :not(.active) hidden state
    const allSlides = document.querySelectorAll('.carousel-slide');
    allSlides.forEach((slide, idx) => {
      if (idx !== pageIndex) {
        const animatable = slide.querySelectorAll(
          '.section-label .char, .section-h2 .char, .hero-eyebrow .char, .hero-h1 .char, .hero-sub .word, ' +
          '.hero-actions a, .about-text p .word, .about-stats .stat, .skills-container, .project-card, .exp-item, ' +
          '.edu-intro .word, .edu-stat, .edu-card, .git-card, .contact-title .char, .terminal-window, .contact-ctas a, .contact-ctas button, .float-chip, .terminal-body p'
        );
        if (animatable.length > 0) {
          gsap.set(animatable, { clearProps: "opacity,transform,clipPath" });
        }
      }
    });

    if (this.currentScrollTween) {
      this.currentScrollTween.kill();
    }

    const scrollObj = { y: fromY };
    const wrapper = document.querySelector('.carousel-wrapper') as HTMLElement;

    if (wrapper) {
      wrapper.style.transition = 'none';
    }

    this.currentScrollTween = gsap.to(scrollObj, {
      y: toY,
      duration: 0.5, // Faster page snapping
      ease: "power2.out",
      onUpdate: () => {
        this.scrollService.setVirtualScrollY(scrollObj.y);
        if (wrapper) {
          wrapper.style.transform = `translateY(${-scrollObj.y}px)`;
        }
      },
      onComplete: () => {
        this.scrollService.setVirtualScrollY(toY);
        if (wrapper) {
          wrapper.style.transform = `translateY(${-pageIndex * 100}vh)`;
        }
        setTimeout(() => {
          this.isTransitioning = false;
        }, 100);
        this.currentScrollTween = null;

        // Trigger premium text entrance animations
        this.animateActiveSlideText(pageIndex);
      }
    });
  }

  animateActiveSlideText(pageIndex: number) {
    if (this.activeTimeline) {
      this.activeTimeline.kill();
    }

    const activeSlide = document.querySelectorAll('.carousel-slide')[pageIndex] as HTMLElement;
    if (!activeSlide) return;

    // Timeline starts instantly for maximum responsiveness
    const tl = gsap.timeline({ delay: 0.0 });
    this.activeTimeline = tl;

    if (pageIndex === 0) {
      const eyebrowChars = activeSlide.querySelectorAll('.hero-eyebrow .char');
      const headingChars = activeSlide.querySelectorAll('.hero-h1 .char');
      const subWords = activeSlide.querySelectorAll('.hero-sub .word');
      const actions = activeSlide.querySelectorAll('.hero-actions a');
      const chips = activeSlide.querySelectorAll('.float-chip');

      if (eyebrowChars.length > 0) {
        tl.fromTo(eyebrowChars, 
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.012, ease: "power2.out" }
        );
      }
      if (headingChars.length > 0) {
        tl.fromTo(headingChars, 
          { opacity: 0, y: 20, skewY: 2 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.45, stagger: 0.015, ease: "power3.out" },
          "-=0.25"
        );
      }
      if (subWords.length > 0) {
        tl.fromTo(subWords, 
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.008, ease: "power2.out" },
          "-=0.3"
        );
      }
      if (actions.length > 0) {
        tl.fromTo(actions, 
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "back.out(1.2)" },
          "-=0.25"
        );
      }
      if (chips.length > 0) {
        tl.fromTo(chips,
          { opacity: 0, scale: 0.8, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.45, stagger: 0.05, ease: "back.out(1.4)" },
          "-=0.3"
        );
      }
    } 
    else if (pageIndex === 1) {
      const labelChars = activeSlide.querySelectorAll('.section-label .char');
      const headingChars = activeSlide.querySelectorAll('.section-h2 .char');
      const photo = activeSlide.querySelector('.about-photo-wrap');
      const paragraphWords = activeSlide.querySelectorAll('.about-text p .word');
      const stats = activeSlide.querySelectorAll('.about-stats .stat');

      if (labelChars.length > 0) {
        tl.fromTo(labelChars, 
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.01, ease: "power2.out" }
        );
      }
      if (headingChars.length > 0) {
        tl.fromTo(headingChars, 
          { opacity: 0, y: 20, skewY: 2 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.45, stagger: 0.01, ease: "power3.out" },
          "-=0.2"
        );
      }
      if (photo) {
        tl.fromTo(photo,
          { opacity: 0, scale: 0.97, y: 12 },
          { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "power3.out" },
          "-=0.3"
        );
      }
      if (paragraphWords.length > 0) {
        tl.fromTo(paragraphWords, 
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.007, ease: "power2.out" },
          "-=0.3"
        );
      }
      if (stats.length > 0) {
        tl.fromTo(stats, 
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: "power3.out" },
          "-=0.25"
        );
      }
    }
    else if (pageIndex === 2) {
      const labelChars = activeSlide.querySelectorAll('.section-label .char');
      const headingChars = activeSlide.querySelectorAll('.section-h2 .char');
      const container = activeSlide.querySelector('.skills-container');

      if (labelChars.length > 0) {
        tl.fromTo(labelChars, 
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.01, ease: "power2.out" }
        );
      }
      if (headingChars.length > 0) {
        tl.fromTo(headingChars, 
          { opacity: 0, y: 20, skewY: 2 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.45, stagger: 0.01, ease: "power3.out" },
          "-=0.2"
        );
      }
      if (container) {
        tl.fromTo(container, 
          { opacity: 0, scale: 0.98, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "power3.out" },
          "-=0.3"
        );
      }
    }
    else if (pageIndex === 3) {
      const labelChars = activeSlide.querySelectorAll('.section-label .char');
      const headingChars = activeSlide.querySelectorAll('.section-h2 .char');
      const cards = activeSlide.querySelectorAll('.project-card');

      if (labelChars.length > 0) {
        tl.fromTo(labelChars, 
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.01, ease: "power2.out" }
        );
      }
      if (headingChars.length > 0) {
        tl.fromTo(headingChars, 
          { opacity: 0, y: 20, skewY: 2 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.45, stagger: 0.01, ease: "power3.out" },
          "-=0.2"
        );
      }
      if (cards.length > 0) {
        tl.fromTo(cards, 
          { opacity: 0, y: 15, scale: 0.98 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 0.45, 
            stagger: 0.05, 
            ease: "power3.out",
            onComplete: () => {
              // Clear transform so 3D tilt hovers work flawlessly
              gsap.set(cards, { clearProps: "transform" });
            }
          },
          "-=0.25"
        );
      }
    }
    else if (pageIndex === 4) {
      const labelChars = activeSlide.querySelectorAll('.section-label .char');
      const headingChars = activeSlide.querySelectorAll('.section-h2 .char');
      const items = activeSlide.querySelectorAll('.exp-item');

      if (labelChars.length > 0) {
        tl.fromTo(labelChars, 
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.01, ease: "power2.out" }
        );
      }
      if (headingChars.length > 0) {
        tl.fromTo(headingChars, 
          { opacity: 0, y: 20, skewY: 2 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.45, stagger: 0.01, ease: "power3.out" },
          "-=0.2"
        );
      }
      if (items.length > 0) {
        tl.fromTo(items, 
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: "power3.out" },
          "-=0.25"
        );
      }
    }
    else if (pageIndex === 5) {
      const labelChars = activeSlide.querySelectorAll('.section-label .char');
      const headingChars = activeSlide.querySelectorAll('.section-h2 .char');
      const introWords = activeSlide.querySelectorAll('.edu-intro .word');
      const stats = activeSlide.querySelectorAll('.edu-stat');
      const card = activeSlide.querySelector('.edu-card');

      if (labelChars.length > 0) {
        tl.fromTo(labelChars, 
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.01, ease: "power2.out" }
        );
      }
      if (headingChars.length > 0) {
        tl.fromTo(headingChars, 
          { opacity: 0, y: 20, skewY: 2 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.45, stagger: 0.01, ease: "power3.out" },
          "-=0.2"
        );
      }
      if (introWords.length > 0) {
        tl.fromTo(introWords, 
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.008, ease: "power2.out" },
          "-=0.3"
        );
      }
      if (stats.length > 0) {
        tl.fromTo(stats, 
          { opacity: 0, y: 12 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.35, 
            stagger: 0.04, 
            ease: "power3.out",
            onComplete: () => {
              gsap.set(stats, { clearProps: "transform" });
            }
          },
          "-=0.25"
        );
      }
      if (card) {
        tl.fromTo(card, 
          { opacity: 0, y: 15 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.45, 
            ease: "power3.out",
            onComplete: () => {
              gsap.set(card, { clearProps: "transform" });
            }
          },
          "-=0.25"
        );
      }
    }
    else if (pageIndex === 6) {
      const labelChars = activeSlide.querySelectorAll('.section-label .char');
      const headingChars = activeSlide.querySelectorAll('.section-h2 .char');
      const cards = activeSlide.querySelectorAll('.git-card');

      if (labelChars.length > 0) {
        tl.fromTo(labelChars, 
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.01, ease: "power2.out" }
        );
      }
      if (headingChars.length > 0) {
        tl.fromTo(headingChars, 
          { opacity: 0, y: 20, skewY: 2 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.45, stagger: 0.01, ease: "power3.out" },
          "-=0.2"
        );
      }
      if (cards.length > 0) {
        tl.fromTo(cards, 
          { opacity: 0, y: 15, scale: 0.98 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 0.45, 
            stagger: 0.06, 
            ease: "power3.out",
            onComplete: () => {
              gsap.set(cards, { clearProps: "transform" });
            }
          },
          "-=0.25"
        );
      }
    }
    else if (pageIndex === 7) {
      const titleChars = activeSlide.querySelectorAll('.contact-title .char');
      const terminal = activeSlide.querySelector('.terminal-window');
      const terminalLines = activeSlide.querySelectorAll('.terminal-body p');
      const ctas = activeSlide.querySelectorAll('.contact-ctas a, .contact-ctas button');

      if (titleChars.length > 0) {
        tl.fromTo(titleChars, 
          { opacity: 0, y: 15, skewY: 2 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.4, stagger: 0.01, ease: "power3.out" }
        );
      }
      if (terminal) {
        tl.fromTo(terminal, 
          { opacity: 0, y: 15, scale: 0.99 },
          { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" },
          "-=0.25"
        );
      }
      if (terminalLines.length > 0) {
        tl.fromTo(terminalLines, 
          { opacity: 0, x: -6 },
          { opacity: 1, x: 0, duration: 0.2, stagger: 0.03, ease: "power2.out" },
          "-=0.2"
        );
      }
      if (ctas.length > 0) {
        tl.fromTo(ctas, 
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "back.out(1.2)" },
          "-=0.2"
        );
      }
    }
  }

  private getSectionElement(index: number): HTMLElement | null {
    const pageId = this.pages[index].id;
    return document.getElementById(pageId);
  }
}

