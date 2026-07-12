import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="about">
      <div class="about-grid">
        <div class="about-photo-wrap">
          <div class="about-glow"></div>
          <img src="assets/images/My Pics/IMG-20260127-WA0070.jpg" class="about-photo" alt="Shivam Kumar Divaker">
        </div>
        <div class="about-text">
          <div class="section-label">01 / About Me</div>
          <h2 class="section-h2">A developer focused on <span>performance</span> and <span>maintainability</span>.</h2>
          <p>I am a <strong>Full-Stack Software Engineer</strong> with 4+ years of professional experience building high-scale financial systems, microservices architectures, and real-time dashboard systems.</p>
          <p>My expertise covers frontend engineering with Angular &amp; RxJS, backend development with Node.js &amp; Express, and database engineering using SQL Server and MongoDB.</p>
          <div class="about-stats">
            <div class="stat">
              <div class="stat-n">4+</div>
              <div class="stat-l">Years XP</div>
            </div>
            <div class="stat">
              <div class="stat-n">15+</div>
              <div class="stat-l">Projects Shipped</div>
            </div>
            <div class="stat">
              <div class="stat-n">8+</div>
              <div class="stat-l">Technologies</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    #about {
      /* Scoped styling handled globally */
    }
  `]
})
export class AboutComponent {}
