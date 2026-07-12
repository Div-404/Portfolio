import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="experience" class="reveal">
      <div class="experience-grid">
        <div class="experience-left-col">
          <div class="section-label">04 / Experience</div>
          <h2 class="section-h2">Professional <span>Journey</span></h2>
          <div class="exp-timeline">
            <div class="exp-item visible" *ngFor="let exp of experiences">
              <div class="exp-dot"></div>
              <div class="exp-period">{{ exp.period }}</div>
              <div class="exp-company">{{ exp.company }}</div>
              <div class="exp-role">{{ exp.role }}</div>
              <div class="exp-card">
                <ul class="exp-bullets">
                  <li *ngFor="let bullet of exp.bullets">{{ bullet }}</li>
                </ul>
                <div class="exp-tags">
                  <span class="exp-tag" *ngFor="let tag of exp.tags">{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="experience-right-col">
          <!-- Empty column for 3D Avatar space -->
        </div>
      </div>
    </section>
  `,
  styles: [`
    #experience {
      padding: 7rem 0;
    }
  `]
})
export class ExperienceComponent {
  experiences = [
    {
      period: 'Jun 2025 - Present',
      company: 'Marketwick Pvt. Ltd.',
      role: 'Full-Stack Software Engineer',
      bullets: [
        'Architected and deployed Node.js microservices for BBPS integrations, handling utility payments across 7+ vendors.',
        'Built automated transaction settlement engine in Node.js (every 15 min), reducing manual intervention by 90%.',
        'Implemented payment status-check layer with retry logic and idempotency guards, reducing failed transaction reports by 35%.',
        'Re-architected Angular frontend from monolithic to modular, raising Lighthouse scores (68 to 85) and boosting TTI by 20%.',
        'Built Slack bots for internal alerting on settlement failures, timeouts, and transaction anomalies.'
      ],
      tags: ['Node.js', 'Express.js', 'Angular', 'BBPS', 'Microservices', 'Cron Jobs', 'Slack API', 'REST APIs']
    },
    {
      period: 'Jan 2023 - Feb 2025',
      company: 'Acro Technologies',
      role: 'Software Engineer',
      bullets: [
        'Designed/consumed RESTful APIs across Angular and .NET Webforms backend, building a unified integration layer for CRM.',
        'Developed 10+ scalable Angular modules using component-driven, service-based architecture, reducing module coupling.',
        'Engineered reusable UI component library (tables, modals, grids) adopted across 5 product lines, accelerating delivery by 25%.',
        'Mentored junior developers and conducted 50+ code reviews enforcing RxJS and Angular reactive programming best practices.'
      ],
      tags: ['Angular', '.NET Webforms', 'RxJS', 'REST APIs', 'Component-Driven Design', 'WCAG 2.1', 'Mentorship']
    },
    {
      period: 'Jan 2022 - Jan 2023',
      company: 'Acro Technologies',
      role: 'Associate Software Engineer',
      bullets: [
        'Delivered 20+ frontend/backend feature enhancements and tuned SQL stored procedures to reduce DB response times by 10%.',
        'Built client-specific reusable UI modules for enterprise CRM workflows, improving client satisfaction scores by 30%.',
        'Diagnosed and resolved 50+ production bugs across UI and REST API layers.'
      ],
      tags: ['Angular', '.NET Webforms', 'SQL Server', 'REST APIs', 'CRM Workflows', 'Debugging']
    }
  ];
}
