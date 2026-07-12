import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="contact">
      <div class="contact-terminal-wrap">

        <!-- Title -->
        <h2 class="contact-title">Let's connect</h2>

        <!-- Terminal window -->
        <div class="terminal-window">
          <div class="terminal-titlebar">
            <span class="tb-dot red"></span>
            <span class="tb-dot yellow"></span>
            <span class="tb-dot green"></span>
            <span class="tb-label">shivam&#64;portfolio ~</span>
          </div>
          <div class="terminal-body">
            <p class="t-cmd">$ echo "Let's build something together"</p>
            <p class="t-cmd">$ cat contact.info</p>
            <p class="t-info"><span class="t-arrow">→</span> <span class="t-name">Shivam Kumar Divaker</span></p>
            <p class="t-info"><span class="t-arrow">→</span> <span class="t-role">Full-Stack Software Engineer</span></p>
            <p class="t-info"><span class="t-arrow">→</span> <span class="t-loc">Noida, India</span></p>
            <p class="t-info"><span class="t-arrow">→</span> <a href="mailto:arjundivaker8@gmail.com" class="t-link">arjundivaker8&#64;gmail.com</a></p>
            <p class="t-info"><span class="t-arrow">→</span> <span class="t-phone">+91 6392372109</span></p>
            <p class="t-info"><span class="t-arrow">→</span> <a href="https://linkedin.com/in/shivam-kumar-divakar-30b567137" target="_blank" class="t-link">linkedin.com/in/shivam-kumar-divakar-30b567137</a></p>
            <p class="t-cmd">$ mail -s "Let's connect" arjundivaker8&#64;gmail.com<span class="t-cursor">█</span></p>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="contact-ctas">
          <button class="cta-btn cta-outline" (click)="copyEmail()" id="copy-email-btn">
            {{ copied ? 'COPIED!' : 'COPY EMAIL' }}
          </button>
          <a href="https://linkedin.com/in/shivam-kumar-divakar-30b567137" target="_blank" class="cta-btn cta-filled" id="view-linkedin-btn">
            VIEW LINKEDIN
          </a>
        </div>

      </div>
    </section>
  `,
  styles: [`
    #contact {
      display: flex;
      align-items: center;
      justify-content: center;
      padding:0 !important;
      // background: transparent !important;
      background: #0a0a0a !important;
      width: 100%;
      box-sizing: border-box;
    }

    .contact-terminal-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.8rem;
      width: 100%;
      max-width: 780px;
      padding: 0rem;
    }

    /* Title */
    .contact-title {
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: clamp(1.9rem, 3vw, 2.6rem);
      font-weight: 400;
      color: #ffffff;
      letter-spacing: -0.02em;
      margin: 0;
      text-align: center;
    }

    /* Terminal Window */
    .terminal-window {
      width: 100%;
      background: #111111;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      overflow: hidden;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
    }

    .terminal-titlebar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: #1a1a1a;
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    }

    .tb-dot {
      width: 13px;
      height: 13px;
      border-radius: 50%;
    }
    .tb-dot.red    { background: #ff5f57; }
    .tb-dot.yellow { background: #febc2e; }
    .tb-dot.green  { background: #28c840; }

    .tb-label {
      margin-left: 10px;
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.45);
      letter-spacing: 0.05em;
    }

    .terminal-body {
      padding: 1rem 1.5rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .t-cmd {
      font-family: 'Courier New', Courier, monospace;
      font-size: 1.08rem;
      color: #d4a853;
      margin: 0;
    }
    .t-cmd:first-child { margin-bottom: 0.2rem; }
    .t-cmd:last-child  { margin-top: 0.4rem; }

    .t-info {
      font-family: 'Courier New', Courier, monospace;
      font-size: 1.08rem;
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      margin: 0;
    }

    .t-arrow {
      color: rgba(255, 255, 255, 0.35);
      font-size: 0.95rem;
      flex-shrink: 0;
    }

    .t-name   { color: #ffffff; font-weight: 600; }
    .t-role   { color: #a0a0a0; }
    .t-loc    { color: #a0a0a0; }
    .t-phone  { color: #a0a0a0; }

    .t-link {
      color: #4fa3d4;
      text-decoration: none;
      transition: color 0.2s;
    }
    .t-link:hover { color: #7ec8f0; }

    .t-cursor {
      display: inline-block;
      color: #d4a853;
      animation: blink 1s step-end infinite;
      margin-left: 2px;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }

    /* CTA Buttons */
    .contact-ctas {
      display: flex;
      gap: 1.2rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .cta-btn {
      padding: 0.85rem 2.2rem;
      border-radius: 50px;
      font-family: 'Courier New', monospace;
      font-size: 0.92rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
    }

    .cta-outline {
      background: transparent;
      border: 2px solid #ffffff;
      color: #ffffff;
    }
    .cta-outline:hover {
      background: rgba(255,255,255,0.08);
      transform: translateY(-2px);
    }

    .cta-filled {
      background: #c8a96e;
      border: 2px solid #c8a96e;
      color: #111111;
    }
    .cta-filled:hover {
      background: #dfc080;
      border-color: #dfc080;
      transform: translateY(-2px);
    }
  `]
})
export class ContactComponent {
  copied = false;

  copyEmail() {
    navigator.clipboard.writeText('arjundivaker8@gmail.com').then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    });
  }
}
