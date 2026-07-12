import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2 class="section-title">Selected Projects</h2>
      <div class="project-grid">
        <div class="project-card glass" *ngFor="let p of projects; let i = index" [style.transition-delay]="i * 0.06 + 's'">
          <div class="project-meta">
            <span class="project-year">{{ p.year }}</span>
            <span class="project-role">{{ p.role }}</span>
          </div>
          <h3>{{ p.title }}</h3>
          <p>{{ p.description }}</p>
          <div class="project-tech">
            <span class="tech-tag" *ngFor="let t of p.tags">{{ t }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .project-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
    .project-card { padding: 28px; transition: all 0.3s cubic-bezier(0.22,1,0.36,1); }
    .project-card:hover { border-color: var(--accent-cyan); transform: translateY(-5px); }
    .project-meta { display: flex; gap: 16px; font-size: 12px; color: var(--text-tertiary); margin-bottom: 10px; }
    .project-year { font-family: var(--font-mono); color: var(--accent-cyan); }
    .project-role { text-transform: uppercase; letter-spacing: 0.06em; }
    .project-card h3 { font-size: 1.3rem; margin-bottom: 10px; color: var(--text-primary); }
    .project-card p { font-size: 14px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 14px; }
    .project-tech { display: flex; flex-wrap: wrap; gap: 6px; }
    .tech-tag { padding: 3px 10px; border-radius: 100px; background: rgba(167,139,250,0.08); border: 1px solid rgba(167,139,250,0.15); font-size: 11px; color: var(--accent-purple); font-family: var(--font-mono); }
  `]
})
export class ProjectsComponent {
  projects = [
    { year: '2024', role: 'Lead Engineer', title: 'FinTech Reconciliation Engine', description: 'Real-time transaction matching system processing 2M+ daily events with sub-second latency using event-driven architecture.', tags: ['Go', 'Kafka', 'PostgreSQL', 'React', 'AWS'] },
    { year: '2023', role: 'Full Stack Engineer', title: 'Healthcare Data Platform', description: 'HIPAA-compliant platform unifying patient records across 50+ clinics with FHIR APIs and real-time sync pipeline.', tags: ['TypeScript', 'Node.js', 'GraphQL', 'Docker', 'FHIR'] },
    { year: '2023', role: 'System Architect', title: 'E-Commerce Microservices', description: 'Scalable order management system handling 100K+ daily transactions with event-driven architecture and CQRS pattern.', tags: ['Go', 'gRPC', 'Redis', 'Kubernetes', 'Next.js'] },
    { year: '2022', role: 'Frontend Lead', title: 'Analytics Dashboard Suite', description: 'Real-time visualization platform for business intelligence with custom D3.js charting engine and WebSocket streaming.', tags: ['React', 'D3.js', 'WebSocket', 'TypeScript', 'Tailwind'] },
  ];
}
