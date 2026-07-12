import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="nav-dock" [class.nav-hidden]="hidden">
      <div class="dock-inner glass">
        <a *ngFor="let link of links" [href]="link.href" class="dock-link"
           [class.active]="link.active"
           (click)="scrollTo($event, link.href)">
          <span class="dock-label">{{ link.label }}</span>
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .nav-dock { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); z-index: 1000; transition: transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease; }
    .nav-hidden { transform: translateX(-50%) translateY(100px); opacity: 0; pointer-events: none; }
    .dock-inner { display: flex; align-items: center; gap: 2px; padding: 6px 12px; border-radius: 100px; }
    .dock-link { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 100px; color: var(--text-tertiary); text-decoration: none; font-size: 13px; font-weight: 500; font-family: var(--font-body); transition: all 0.25s cubic-bezier(0.22,1,0.36,1); cursor: pointer; }
    .dock-link:hover, .dock-link.active { color: var(--accent-cyan); background: rgba(0,212,255,0.08); }
    @media (max-width: 768px) { .nav-dock { bottom: 16px; } .dock-inner { padding: 4px 8px; gap: 0; } .dock-link { padding: 6px 10px; font-size: 11px; } }
  `]
})
export class NavComponent {
  hidden = false;
  private lastScroll = 0;
  links = [
    { href: '#hero', label: 'Home', active: false },
    { href: '#experience', label: 'Experience', active: false },
    { href: '#projects', label: 'Projects', active: false },
    { href: '#journey', label: 'Timeline', active: false },
    { href: '#skills', label: 'Skills', active: false },
    { href: '#contact', label: 'Contact', active: false },
  ];

  @HostListener('window:scroll')
  onScroll() {
    const curr = window.scrollY;
    this.hidden = curr > this.lastScroll && curr > 120;
    this.lastScroll = curr;
    const ids = this.links.map(l => l.href.slice(1));
    let activeIdx = 0;
    for (let i = ids.length - 1; i >= 0; i--) {
      const el = document.getElementById(ids[i]);
      if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) { activeIdx = i; break; }
    }
    this.links.forEach((l, i) => l.active = i === activeIdx);
  }

  scrollTo(e: Event, href: string) {
    e.preventDefault();
    const id = href.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
