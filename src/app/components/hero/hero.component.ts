import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="hero">
      <div class="hero-left">
        <div class="hero-eyebrow">Available for opportunities</div>
        <h1 class="hero-h1">
          <span class="word"><span class="char">S</span><span class="char">h</span><span class="char">i</span><span class="char">v</span><span class="char">a</span><span class="char">m</span></span>
          <span class="word"><span class="char">&nbsp;</span></span>
          <span class="word"><span class="char">K</span><span class="char">u</span><span class="char">m</span><span class="char">a</span><span class="char">r</span></span>
          <br>
          <span class="word accent"><span class="char">D</span><span class="char">i</span><span class="char">v</span><span class="char">a</span><span class="char">k</span><span class="char">e</span><span class="char">r</span></span>
        </h1>
      </div>
      
      <div class="hero-center">
        <div class="hero-photo-frame" id="hero-frame">
          <img src="assets/images/My Pics/IMG_20260606_221240_389.webp" alt="Shivam Kumar Divaker">
          <div class="float-chip chip-loc">📍 Noida, India</div>
          <div class="float-chip chip-xp">⚡ 4+ Years XP</div>
          <div class="float-chip chip-open">🟢 Open to Work</div>
        </div>
      </div>
      
      <div class="hero-right">
        <p class="hero-sub">Full-Stack Software Engineer with 4+ years architecting payment platforms, real-time dashboards, and automation systems that run at scale.</p>
        <div class="hero-actions">
          <a href="#projects" class="btn-primary">View Projects ↓</a>
          <a href="assets/resume/Shivam_Kumar_Divaker.pdf" download class="btn-ghost">Resume 📥</a>
          <a href="#contact" class="btn-ghost">Get in Touch</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    #hero {
      /* Scoped styling if needed, but handled globally via styles.scss */
    }
  `]
})
export class HeroComponent {}
