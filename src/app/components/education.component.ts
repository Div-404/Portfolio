import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="education" class="reveal">
      <div class="edu-full-layout">

        <!-- ── LEFT COLUMN — Empty (3D Avatar lives here) ── -->
        <div class="edu-left-empty"></div>

        <!-- ── RIGHT COLUMN — All content ── -->
        <div class="edu-right">

          <!-- Header -->
          <div class="section-label">05 / Education</div>
          <h2 class="section-h2">Academic <span>Foundation</span></h2>

          <p class="edu-intro">
            Grounded in computer science fundamentals, I transformed academic
            curiosity into real-world engineering — building systems that scale,
            perform, and matter.
          </p>

          <!-- Stats row -->
          <div class="edu-stat-row">
            <div class="edu-stat">
              <div class="edu-stat-n">4+</div>
              <div class="edu-stat-l">Years Experience</div>
            </div>
            <div class="edu-stat">
              <div class="edu-stat-n">2022</div>
              <div class="edu-stat-l">Graduated</div>
            </div>
            <div class="edu-stat">
              <div class="edu-stat-n">B.Tech</div>
              <div class="edu-stat-l">CSE Degree</div>
            </div>
          </div>

          <!-- Degree card -->
          <div class="edu-card">
            <div class="edu-icon">🎓</div>
            <div>
              <div class="edu-degree">Bachelor of Technology in Computer Science &amp; Engineering</div>
              <div class="edu-inst">Kanpur Institute of Technology, India</div>
              <div class="edu-period">2018 – 2022</div>
              <div class="edu-highlights">
                <span class="edu-tag">Data Structures</span>
                <span class="edu-tag">Algorithms</span>
                <span class="edu-tag">OS</span>
                <span class="edu-tag">DBMS</span>
                <span class="edu-tag">Computer Networks</span>
                <span class="edu-tag">OOP</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `,
  styles: [`
    #education {
      max-width: 100% !important;
      padding-left: 5rem !important;
      padding-right: 5rem !important;
    }

    .edu-full-layout {
      display: grid;
      grid-template-columns: 1fr 1.3fr;
      gap: 4rem;
      align-items: center;
      max-width: 1300px;
      margin: 0 auto;
    }

    /* Empty left — avatar is rendered via the scene component overlay */
    .edu-left-empty { min-height: 1px; }

    /* ─── RIGHT — all content ─── */
    .edu-right {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    /* Override global large bottom margin on h2 to sit nicely with the description */
    .edu-right .section-h2 {
      margin-bottom: 1rem !important;
    }

    .edu-intro {
      font-size: 1.08rem;
      line-height: 1.85;
      color: var(--muted);
      max-width: 480px;
      margin-bottom: 0.5rem;
    }

    /* Stats row: glass panels instead of simple text */
    .edu-stat-row {
      display: flex;
      gap: 1.2rem;
      flex-wrap: wrap;
      margin-bottom: 0.5rem;
    }
    .edu-stat {
      flex: 1;
      min-width: 130px;
      padding: 1.1rem 1.25rem;
      background: var(--glass);
      border: 1px solid var(--glass-b);
      border-radius: 12px;
      backdrop-filter: blur(8px);
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    .edu-stat::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(0, 255, 255, 0.05) 0%, transparent 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .edu-stat:hover {
      transform: translateY(-3px);
      border-color: var(--glass-bh);
      background: rgba(255, 255, 255, 0.06);
      box-shadow: 0 8px 24px rgba(0, 255, 255, 0.05);
    }
    .edu-stat:hover::before {
      opacity: 1;
    }
    .edu-stat-n {
      font-family: var(--font-h);
      font-size: 2.2rem;
      font-weight: 900;
      background: linear-gradient(135deg, var(--white), var(--cyan));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .edu-stat-l {
      font-size: 0.78rem;
      color: var(--muted);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-family: var(--font-m);
    }

    /* Degree card: glass container aligned cleanly */
    .edu-card {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 2rem;
      align-items: center;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
      border: 1px solid var(--glass-b);
      border-radius: 16px;
      padding: 2rem 2.25rem;
      backdrop-filter: blur(12px);
      transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
      max-width: 100%;
    }
    .edu-card:hover {
      border-color: var(--cyan);
      box-shadow: 0 12px 36px rgba(0, 255, 255, 0.08);
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
    }

    /* Holographic radar/pulsing icon */
    .edu-icon {
      width: 68px;
      height: 68px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(0, 255, 255, 0.12), rgba(0, 130, 124, 0.25));
      border: 1px solid var(--cyan);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      flex-shrink: 0;
      position: relative;
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.15);
      transition: all 0.4s ease;
    }
    .edu-card:hover .edu-icon {
      transform: scale(1.05);
      box-shadow: 0 0 25px rgba(0, 255, 255, 0.35);
      background: linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(0, 130, 124, 0.35));
    }
    .edu-icon::before {
      content: '';
      position: absolute;
      inset: -5px;
      border-radius: 50%;
      border: 1px dashed rgba(0, 255, 255, 0.4);
      animation: rotateRing 15s linear infinite;
    }
    .edu-icon::after {
      content: '';
      position: absolute;
      inset: -10px;
      border-radius: 50%;
      border: 1px solid rgba(0, 255, 255, 0.1);
      animation: pulseRadar 3s ease-out infinite;
    }
    @keyframes rotateRing {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulseRadar {
      0% { transform: scale(0.95); opacity: 0; }
      50% { opacity: 0.5; }
      100% { transform: scale(1.15); opacity: 0; }
    }

    .edu-degree {
      font-family: var(--font-h);
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 0.4rem;
      color: var(--white);
      line-height: 1.45;
    }
    .edu-inst {
      color: var(--muted);
      font-size: 1.05rem;
      margin-bottom: 0.4rem;
    }
    .edu-period {
      font-family: var(--font-m);
      font-size: 0.82rem;
      color: var(--cyan);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 0.8rem;
    }

    .edu-highlights {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }
    .edu-tag {
      padding: 0.25rem 0.65rem;
      border: 1px solid var(--glass-b);
      border-radius: 6px;
      font-family: var(--font-m);
      font-size: 0.72rem;
      color: var(--cyan);
      letter-spacing: 0.05em;
      background: rgba(0, 255, 255, 0.03);
      transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .edu-tag:hover {
      background: rgba(0, 255, 255, 0.1);
      border-color: var(--cyan);
      color: var(--white);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 255, 255, 0.15);
    }

    @media (max-width: 900px) {
      .edu-full-layout { grid-template-columns: 1fr; gap: 2rem; }
      .edu-left-empty { display: none; }
      #education { padding-left: 1.75rem !important; padding-right: 1.75rem !important; }
    }
  `]
})
export class EducationComponent {}
