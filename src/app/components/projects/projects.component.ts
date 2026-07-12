import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  title: string;
  tag: string;
  desc: string;
  tech: string[];
  metricNum: string;
  metricLabel: string;
  link: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="projects">
      <div class="projects-section-grid">
        <div class="projects-left-col">
          <!-- Empty column for 3D Avatar space -->
        </div>
        <div class="projects-right-col">
          <div class="section-label">03 / Projects</div>
          <h2 class="section-h2">Featured <span>Work</span></h2>
          <div class="projects-grid">
            <a 
              *ngFor="let p of projects" 
              [href]="p.link" 
              target="_blank" 
              class="project-card"
              #cardEl
              (mousemove)="onMouseMove($event, cardEl)"
            >
              <div class="project-glare"></div>
              <div class="project-tag">{{ p.tag }}</div>
              <h3 class="project-h3">{{ p.title }}</h3>
              <p class="project-p">{{ p.desc }}</p>
              <div class="project-tech">
                <span class="tech-pill" *ngFor="let t of p.tech">{{ t }}</span>
              </div>
              <div class="project-metric">
                <span class="metric-num">{{ p.metricNum }}</span>
                <span class="metric-lbl">{{ p.metricLabel }}</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    #projects {
      /* Scoped styling handled globally */
    }
  `]
})
export class ProjectsComponent {
  projects: Project[] = [
    {
      title: 'BBPS Multi-Vendor Payment Engine',
      tag: 'Backend Service',
      desc: 'Architected and deployed Node.js microservices for BBPS integrations. Developed an automated 15-minute cron settlement scheduler with idempotency keys and retry logic to auto-settle pending transactions.',
      tech: ['Node.js', 'Express.js', 'node-cron', 'SQL Server', 'REST APIs'],
      metricNum: '90%',
      metricLabel: 'Backlog Reduction',
      link: 'https://github.com/Div-404'
    },
    {
      title: 'Slack Automation & Alerting Platform',
      tag: 'Integrations',
      desc: 'Engineered event-driven system health alerting and settlement monitoring bots. Created self-service Slack workflows for manual settlement triggers, timeouts, and vendor health checks.',
      tech: ['Node.js', 'Slack API', 'Webhooks', 'REST APIs'],
      metricNum: '35%',
      metricLabel: 'Failure Rate Reduction',
      link: 'https://github.com/Div-404'
    },
    {
      title: 'MT5 Real-Time Trading Dashboard',
      tag: 'Frontend Platform',
      desc: 'Built streaming dashboards consuming WebSocket feeds to display real-time financial trading metrics. Implemented Angular OnPush change detection to handle 1000+ events/sec.',
      tech: ['Angular', 'WebSockets', 'RxJS', 'TypeScript', 'Highcharts'],
      metricNum: '1000+',
      metricLabel: 'Events / Sec',
      link: 'https://github.com/Div-404'
    },
    {
      title: 'XRM CRM Platform Revamp',
      tag: 'Enterprise Web',
      desc: 'Modernized legacy CRM systems from ASP.NET WebForms to Angular. Engineered a reusable component library (tables, modals, grids) adopted across 5 product lines.',
      tech: ['Angular', 'TypeScript', '.NET Webforms', 'SQL Server', 'SCSS'],
      metricNum: '30%',
      metricLabel: 'Load Time Reduction',
      link: 'https://github.com/Div-404'
    }
  ];

  onMouseMove(e: MouseEvent, card: HTMLElement) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    card.style.setProperty('--gx', `${px}%`);
    card.style.setProperty('--gy', `${py}%`);
  }
}
