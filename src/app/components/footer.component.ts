import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: ` <footer class="site-footer"><div class="container footer-inner"><span class="footer-brand">SKD</span><span>&copy; {{ year }} Shivam Kumar Divaker. Built with Angular &amp; Three.js</span></div></footer> `,
  styles: [`
    .site-footer { background: var(--midnight); border-top: 1px solid var(--glass-border); padding: 24px 0; }
    .footer-inner { display: flex; align-items: center; justify-content: center; gap: 16px; }
    .footer-brand { font-weight: 700; font-size: 16px; color: var(--accent-cyan); font-family: var(--font-mono); }
    .site-footer span:last-child { font-size: 13px; color: var(--text-tertiary); }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
}
