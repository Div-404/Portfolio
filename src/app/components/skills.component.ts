import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2 class="section-title">Skills &amp; Competencies</h2>
      <div class="skills-grid">
        <div class="skill-category glass" *ngFor="let group of skillGroups; let i = index" [style.transition-delay]="i * 0.06 + 's'">
          <h3>{{ group.category }}</h3>
          <div class="skill-list">
            <span class="skill-item" *ngFor="let skill of group.items">{{ skill }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
    .skill-category { padding: 24px; transition: all 0.3s cubic-bezier(0.22,1,0.36,1); }
    .skill-category:hover { border-color: var(--accent-cyan); transform: translateY(-5px); }
    .skill-category h3 { font-size: 1.1rem; margin-bottom: 14px; color: var(--accent-emerald); }
    .skill-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill-item { padding: 5px 14px; border-radius: 100px; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.15); font-size: 13px; color: var(--text-primary); transition: all 0.2s ease; }
    .skill-item:hover { background: rgba(16,185,129,0.15); border-color: var(--accent-emerald); }
  `]
})
export class SkillsComponent {
  skillGroups = [
    { category: 'Frontend', items: ['TypeScript', 'React / Next.js', 'Angular', 'Tailwind CSS', 'Three.js', 'D3.js'] },
    { category: 'Backend', items: ['Go', 'Node.js', 'Python', 'PostgreSQL', 'Redis', 'Kafka'] },
    { category: 'Cloud & DevOps', items: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux'] },
    { category: 'System Design', items: ['Microservices', 'Event-Driven', 'gRPC', 'GraphQL', 'REST', 'CQRS'] },
  ];
}
