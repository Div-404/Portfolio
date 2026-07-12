import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hero-section container">
      <div class="hero-content">
        <div class="tagline">
          <span class="badge-dot"></span>
          Full Stack · 4+ Years
        </div>
        <h1>Shivam Kumar Divaker</h1>
        <p class="hero-subtitle">Architecting systems that move data, money, and decisions. TypeScript · Go · React · Angular · AWS</p>
        <div class="hero-stats">
          <div class="stat" *ngFor="let s of stats">
            <span class="stat-num">{{ s.num }}</span>
            <span class="stat-label">{{ s.label }}</span>
          </div>
        </div>
        <div class="hero-actions">
          <a href="#projects" class="cta-button">View Work →</a>
          <a href="#contact" class="btn-glass">Get in Touch</a>
        </div>
      </div>
      <div class="hero-3d">
        <div class="hero-orb">
          <div class="orb orb-1"></div>
          <div class="orb orb-2"></div>
          <div class="orb orb-3"></div>
        </div>
      </div>
      <div class="hero-marquee">
        <div class="marquee-track">
          <span class="marquee-item" *ngFor="let item of marqueeItems">{{ item }}</span>
          <span class="marquee-item" *ngFor="let item of marqueeItems">{{ item }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-section { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; padding-top: 80px; position: relative; }
    .hero-content { display: flex; flex-direction: column; gap: 24px; }
    .tagline { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px 6px 8px; border-radius: 100px; background: var(--glass-bg); backdrop-filter: blur(12px); border: 1px solid var(--glass-border); font-size: 13px; color: var(--accent-cyan); font-family: var(--font-mono); width: fit-content; }
    .badge-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent-cyan); animation: pulse-dot 2s ease-in-out infinite; }
    @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .hero-content h1 { font-size: 3.8rem; font-weight: 700; line-height: 1.1; background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hero-subtitle { font-size: 18px; color: var(--text-secondary); line-height: 1.6; max-width: 520px; }
    .hero-stats { display: flex; gap: 40px; margin-top: 8px; }
    .stat { display: flex; flex-direction: column; gap: 2px; }
    .stat-num { font-family: var(--font-mono); font-size: 32px; font-weight: 700; color: var(--accent-cyan); }
    .stat-label { font-size: 12px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; }
    .hero-actions { display: flex; gap: 12px; margin-top: 8px; }
    .hero-3d { display: flex; justify-content: center; align-items: center; }
    .hero-orb { position: relative; width: 380px; height: 380px; }
    .orb { position: absolute; border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%); }
    .orb-1 { width: 300px; height: 300px; background: radial-gradient(circle at 30% 30%, rgba(0,212,255,0.12), transparent 70%); animation: orb-float 8s ease-in-out infinite; }
    .orb-2 { width: 220px; height: 220px; background: radial-gradient(circle at 70% 40%, rgba(167,139,250,0.1), transparent 70%); animation: orb-float 10s ease-in-out infinite reverse; }
    .orb-3 { width: 150px; height: 150px; background: radial-gradient(circle at 40% 60%, rgba(16,185,129,0.08), transparent 60%); animation: orb-float 7s ease-in-out infinite 2s; }
    @keyframes orb-float { 0%,100%{transform:translate(-50%,-50%)} 50%{transform:translate(-50%,-60%)} }
    .hero-marquee { position: absolute; bottom: 40px; left: 0; right: 0; overflow: hidden; padding: 16px 0; border-top: 1px solid var(--glass-border); }
    .marquee-track { display: flex; gap: 40px; white-space: nowrap; animation: marquee-scroll 30s linear infinite; will-change: transform; }
    .marquee-item { font-family: var(--font-mono); font-size: 12px; color: var(--text-tertiary); letter-spacing: 0.15em; text-transform: uppercase; }
    @keyframes marquee-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    @media (max-width: 768px) { .hero-section { grid-template-columns: 1fr; gap: 40px; padding-top: 60px; } .hero-content h1 { font-size: 2.5rem; } .hero-3d { display: none; } .hero-stats { gap: 20px; } .stat-num { font-size: 24px; } .hero-actions { flex-direction: column; } }
  `]
})
export class HeroComponent implements OnInit, OnDestroy {
  stats = [
    { num: '4+', label: 'Years Exp' },
    { num: '20+', label: 'Projects' },
    { num: '12+', label: 'Clients' },
    { num: '8', label: 'Tech Stack' },
  ];
  marqueeItems = [
    'Full Stack Engineering', 'System Architecture', 'Cloud Infrastructure',
    'Distributed Systems', 'API Design', 'Performance Optimization',
    'TypeScript', 'Go', 'React', 'Angular', 'AWS', 'PostgreSQL'
  ];
  private animFrame = 0;

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const track = document.querySelector('.marquee-track') as HTMLElement;
    }
  }

  ngOnDestroy() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }
}
