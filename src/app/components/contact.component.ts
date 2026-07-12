import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="contact-section container">
      <div class="contact-layout">
        <div class="contact-info">
          <div class="contact-badge">
            <span class="status-dot"></span>
            <span>Available for opportunities</span>
          </div>
          <h2 class="section-title" style="text-align:left; margin-bottom:0.5rem">Get in Touch</h2>
          <p class="contact-desc">
            I'm currently open to freelance projects, full-time roles, and interesting collaborations.
            Whether you have a specific project in mind or just want to connect, I'd love to hear from you.
          </p>
          <div class="terminal">
            <div class="terminal-line"><span class="prompt">$</span> <span class="cmd">echo</span> contact</div>
            <div class="terminal-line"><span class="prompt">></span> ✉ <a [href]="'mailto:' + email">{{ email }}</a></div>
            <div class="terminal-line"><span class="prompt">></span> ⌘ <a [href]="github" target="_blank">github.com/shivam-divaker</a></div>
            <div class="terminal-line"><span class="prompt">></span> ◎ <a [href]="linkedin" target="_blank">linkedin.com/in/shivam-divaker</a></div>
            <div class="terminal-line cursor-line"><span class="prompt">$</span> <span class="cursor">█</span></div>
          </div>
        </div>
        <div class="contact-visual">
          <div class="contact-orb">
            <div class="c-orb c-orb-1"></div>
            <div class="c-orb c-orb-2"></div>
            <div class="c-orb c-orb-3"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-section { padding: 40px 0; }
    .contact-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
    .contact-info { display: flex; flex-direction: column; gap: 20px; }
    .contact-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px 6px 8px; border-radius: 100px; background: var(--glass-bg); border: 1px solid var(--glass-border); font-size: 13px; color: var(--text-tertiary); width: fit-content; }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #34d399; animation: pulse-dot 2s ease-in-out infinite; }
    @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .contact-desc { font-size: 15px; color: var(--text-secondary); line-height: 1.7; max-width: 480px; }
    .terminal { background: rgba(0,0,0,0.3); border: 1px solid var(--glass-border); border-radius: 12px; padding: 20px 24px; font-family: var(--font-mono); font-size: 13px; line-height: 2; }
    .terminal-line { color: var(--text-tertiary); }
    .prompt { color: var(--accent-emerald); font-weight: 700; margin-right: 8px; }
    .cmd { color: var(--accent-cyan); }
    .terminal-line a { color: var(--text-primary); text-decoration: none; transition: color 0.2s; }
    .terminal-line a:hover { color: var(--accent-cyan); }
    .cursor { animation: blink 1s step-end infinite; color: var(--accent-emerald); }
    @keyframes blink { 50% { opacity: 0; } }
    .contact-visual { display: flex; justify-content: center; align-items: center; }
    .contact-orb { position: relative; width: 280px; height: 280px; }
    .c-orb { position: absolute; border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%); }
    .c-orb-1 { width: 220px; height: 220px; background: radial-gradient(circle at 30% 30%, rgba(0,212,255,0.15), transparent 70%); animation: float 8s ease-in-out infinite; }
    .c-orb-2 { width: 160px; height: 160px; background: radial-gradient(circle at 70% 40%, rgba(167,139,250,0.12), transparent 70%); animation: float 10s ease-in-out infinite reverse; }
    .c-orb-3 { width: 100px; height: 100px; background: radial-gradient(circle at 40% 60%, rgba(16,185,129,0.1), transparent 60%); animation: float 7s ease-in-out infinite 2s; }
    @keyframes float { 0%,100%{transform:translate(-50%,-50%)} 50%{transform:translate(-50%,-60%)} }
    @media (max-width: 768px) { .contact-layout { grid-template-columns: 1fr; gap: 40px; } .contact-visual { display: none; } }
  `]
})
export class ContactComponent {
  email = 'shivam.divaker@example.com';
  github = 'https://github.com/shivam-divaker';
  linkedin = 'https://linkedin.com/in/shivam-divaker';
}
