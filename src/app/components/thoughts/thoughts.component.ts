import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-thoughts',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  template: `
    <section id="thoughts" class="section thoughts">
      <!-- Section Watermark Number -->
      <span class="section-number">04</span>

      <div class="container">
        <span class="eyebrow" appReveal>/Notes</span>
        <h2 class="thoughts-title display" appReveal>Thoughts</h2>

        <div class="thoughts-grid">
          <a class="glass-card t-card t-image" appReveal [revealDelay]="80"
             style="background-image: url('assets/images/avatar-bust.jpg')">
            <div class="t-overlay"></div>
            <div class="t-content">
              <span class="t-date mono">Settlement Engine</span>
              <h3 class="display">Idempotency is the quiet hero of payment systems</h3>
              <p>Retries and webhooks fail in production all the time — designing for
                 "safe to repeat" beats trying to prevent failure entirely.</p>
            </div>
          </a>

          <a class="glass-card t-card t-image" appReveal [revealDelay]="160"
             style="background-image: url('assets/images/Gemini_Generated_Image_ubokpzubokpzubok.png')">
            <div class="t-overlay"></div>
            <div class="t-content">
              <span class="t-date mono">Angular at Scale</span>
              <h3 class="display">Reusable components save more time than clever code</h3>
              <p>30+ shared components across 5 product lines taught me that boring,
                 well-documented building blocks beat bespoke solutions every time.</p>
            </div>
          </a>

          <a href="#projects" class="glass-card t-card t-cta" appReveal [revealDelay]="240">
            <h3 class="display">See how I turn messy backend problems into systems that just run — explore my work</h3>
            <span class="t-link">
              <span>View All Work</span>
              <span class="arrow">↗</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .thoughts { background: transparent; }
    .thoughts-title {
      font-size: clamp(1.8rem, 3.5vw, 3rem);
      color: var(--surface-white); margin-bottom: 48px;
    }

    .thoughts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
    }

    .t-card {
      min-height: 360px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      overflow: hidden;
      cursor: pointer;
    }

    .t-image {
      background-size: cover;
      background-position: center;
      color: var(--surface-white);
      border: 1px solid var(--glass-border);
    }
    .t-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(13,13,13,0.15) 0%, rgba(13,13,13,0.92) 85%);
      z-index: 0;
    }
    .t-content { position: relative; z-index: 1; }
    .t-date {
      font-size: 11px;
      letter-spacing: 0.1em; color: var(--cyan-light); text-transform: uppercase;
      display: block; margin-bottom: 10px;
      text-shadow: 0 0 8px rgba(0, 212, 255, 0.25);
    }
    .t-content h3 {
      font-size: 1.3rem; line-height: 1.3; margin-bottom: 10px; color: var(--surface-white);
    }
    .t-content p { font-size: 13.5px; line-height: 1.6; color: rgba(245, 240, 232, 0.7); }

    .t-cta {
      background: var(--depth-bg-2);
      color: var(--surface-white);
      justify-content: space-between;
    }
    .t-cta h3 {
      font-size: clamp(1.3rem, 2.4vw, 1.7rem);
      line-height: 1.35; font-weight: 500;
      color: var(--surface-white);
    }
    .t-link {
      display: inline-flex; align-items: center; justify-content: space-between;
      font-size: 13px; font-weight: 600; margin-top: 24px;
      color: var(--cyan-light);
      width: 100%;
    }
    .arrow {
      display: inline-flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; border-radius: 50%; border: 1px solid rgba(0, 212, 255, 0.35);
      transition: background 0.2s, border-color 0.2s, color 0.2s;
    }
    .t-cta:hover .arrow {
      background: rgba(0, 212, 255, 0.1);
      border-color: var(--cyan-light);
      color: var(--cyan-light);
      box-shadow: 0 0 10px rgba(0, 212, 255, 0.2);
    }

    @media (max-width: 900px) {
      .thoughts-grid { grid-template-columns: 1fr; }
      .t-card { min-height: 280px; }
    }
  `]
})
export class ThoughtsComponent {}
