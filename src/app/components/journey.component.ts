import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-journey',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2 class="section-title">Professional Journey</h2>
      <div class="timeline">
        <div class="timeline-item" *ngFor="let item of milestones; let i = index" [style.transition-delay]="i * 0.08 + 's'">
          <div class="timeline-dot">{{ item.icon }}</div>
          <div class="timeline-content glass">
            <div class="timeline-year">{{ item.year }}</div>
            <h3>{{ item.title }}</h3>
            <div class="timeline-company">{{ item.company }}</div>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .timeline { position: relative; max-width: 700px; margin: 0 auto; padding-left: 40px; }
    .timeline::before { content: ''; position: absolute; left: 20px; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, transparent, var(--accent-cyan), var(--accent-purple), transparent); opacity: 0.3; }
    .timeline-item { position: relative; margin-bottom: 24px; transition: transform 0.3s cubic-bezier(0.22,1,0.36,1); }
    .timeline-item:hover { transform: translateX(4px); }
    .timeline-dot { position: absolute; left: -28px; top: 20px; font-size: 20px; z-index: 1; }
    .timeline-content { padding: 20px 24px; transition: border-color 0.3s ease; }
    .timeline-content:hover { border-color: var(--accent-purple); }
    .timeline-year { font-family: var(--font-mono); font-size: 12px; color: var(--accent-cyan); margin-bottom: 4px; }
    .timeline-content h3 { font-size: 1.2rem; margin-bottom: 2px; color: var(--text-primary); }
    .timeline-company { font-size: 13px; color: var(--accent-purple); margin-bottom: 8px; }
    .timeline-content p { font-size: 14px; color: var(--text-secondary); line-height: 1.7; }
    @media (max-width: 768px) { .timeline { padding-left: 32px; } .timeline-dot { left: -24px; font-size: 16px; } }
  `]
})
export class JourneyComponent {
  milestones = [
    { icon: '🚀', year: '2024', title: 'Senior Software Engineer', company: 'FinTech Corp', description: 'Architected real-time reconciliation engine processing 2M+ daily events. Led migration from monolith to event-driven microservices.' },
    { icon: '🏗️', year: '2023', title: 'Full Stack Engineer', company: 'HealthTech Inc', description: 'Built HIPAA-compliant data platform unifying 50+ clinics. Designed FHIR API layer and real-time sync pipeline handling 1M+ records daily.' },
    { icon: '⚡', year: '2022', title: 'Software Engineer', company: 'E-Commerce Co', description: 'Developed microservices for order management. Implemented event sourcing with Kafka and CQRS pattern, reducing order latency by 60%.' },
    { icon: '📊', year: '2021', title: 'Junior Developer', company: 'StartupXYZ', description: 'Built analytics dashboard with custom D3.js visualizations serving 10K+ daily users. Owned frontend architecture and design system.' },
    { icon: '🎓', year: '2020', title: 'CS Graduate', company: 'University', description: 'B.Tech in Computer Science. Focused on distributed systems, algorithms, and software engineering.' },
  ];
}
