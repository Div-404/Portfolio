import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Course {
  title: string;
  provider: string;
  icon: string;
  progress: number;
  status: 'in-progress' | 'completed' | 'planned';
  color: string;
  tags: string[];
  desc: string;
}

@Component({
  selector: 'app-learning',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="learning" class="section">
      <div class="container">
        <h2 class="section-title display">Currently Learning</h2>
        <p class="section-sub">Leveling up — AI, LLMs, and the future of engineering.</p>
 
        <div class="courses-grid">
          <div class="course-card glass-card" *ngFor="let c of courses" [class.active]="c.status === 'in-progress'">
            <div class="course-top">
              <div class="course-icon" [style.background]="'linear-gradient(135deg,' + c.color + '22,' + c.color + '11)'">
                {{ c.icon }}
              </div>
              <div class="course-badge" [class]="c.status">
                {{ c.status === 'in-progress' ? '🔥 In Progress' : c.status === 'completed' ? '✅ Done' : '📋 Planned' }}
              </div>
            </div>
            <h3 class="course-title display">{{ c.title }}</h3>
            <div class="course-provider">{{ c.provider }}</div>
            <p class="course-desc">{{ c.desc }}</p>
            <div class="course-tags">
              <span *ngFor="let t of c.tags">{{ t }}</span>
            </div>
            <div class="progress-section" *ngIf="c.status !== 'planned'">
              <div class="progress-label">
                <span>Progress</span>
                <span [style.color]="c.color">{{ c.progress }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width]="c.progress + '%'" [style.background]="c.color"></div>
              </div>
            </div>
          </div>
        </div>
 
        <!-- GitHub stats widget -->
        <div class="github-section">
          <h3 class="gh-title display">GitHub Activity — <a href="https://github.com/Div-404" target="_blank" class="gh-link">Div-404</a></h3>
          <div class="gh-widgets">
            <img
              src="https://github-readme-stats.vercel.app/api?username=Div-404&show_icons=true&theme=radical&bg_color=00000000&hide_border=true&title_color=00ffff&text_color=ffffff&icon_color=ff00ff"
              alt="GitHub Stats"
              class="gh-stat-img"
              onerror="this.style.display='none'"
            />
            <img
              src="https://github-readme-stats.vercel.app/api/top-langs/?username=Div-404&layout=compact&theme=radical&bg_color=00000000&hide_border=true&title_color=00ffff&text_color=ffffff"
              alt="Top Languages"
              class="gh-stat-img"
              onerror="this.style.display='none'"
            />
          </div>
          <div class="gh-streak">
            <img
              src="https://streak-stats.demolab.com?user=Div-404&theme=radical&background=00000000&border=00000000&ring=00ffff&fire=ff00ff&currStreakLabel=00ffff"
              alt="GitHub Streak"
              class="gh-streak-img"
              onerror="this.style.display='none'"
            />
          </div>
          <div class="gh-contrib">
            <img
              src="https://ghchart.rshah.org/00ffff/Div-404"
              alt="GitHub Contribution Chart"
              class="gh-contrib-img"
              onerror="this.style.display='none'"
            />
          </div>
          <div class="gh-repos" *ngIf="repos.length">
            <a *ngFor="let r of repos" [href]="r.html_url" target="_blank" class="repo-card glass-card">
              <div class="repo-name">📁 {{ r.name }}</div>
              <div class="repo-desc">{{ r.description || 'No description' }}</div>
              <div class="repo-meta">
                <span class="repo-lang" *ngIf="r.language">● {{ r.language }}</span>
                <span class="repo-stars">⭐ {{ r.stargazers_count }}</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .section { padding: 100px 48px; position: relative; z-index: 1; }
    .container { max-width: 1000px; margin: 0 auto; }
    .section-title {
      font-size: clamp(36px, 5vw, 56px);
      font-weight: 700; text-align: center; margin-bottom: 16px;
      color: var(--surface-white);
    }
    .section-sub {
      font-size: 17px; color: var(--surface-white); opacity: 0.65;
      text-align: center; max-width: 500px;
      margin: 0 auto 50px; line-height: 1.7;
    }

    /* Course cards */
    .courses-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 70px; }
    .course-card {
      padding: 24px;
      transition: all 0.3s; position: relative;
    }
    .course-card:hover { transform: translateY(-4px); border-color: rgba(0,212,255,0.35); }
    .course-card.active { border-color: rgba(0,212,255,0.25); }
    .course-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
    .course-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
    .course-badge { font-size: 10px; font-weight: 600; padding: 4px 10px; border-radius: 20px; white-space: nowrap; }
    .course-badge.in-progress { background: rgba(0,212,255,0.1); color: var(--cyan-light); border: 1px solid rgba(0,212,255,0.25); }
    .course-badge.completed { background: rgba(0,255,136,0.1); color: #20bf6b; border: 1px solid rgba(0,255,136,0.25); }
    .course-badge.planned { background: var(--glass-bg); color: var(--surface-white); opacity: 0.5; border: 1px solid var(--glass-border); }
    .course-title { font-size: 15px; font-weight: 700; color: var(--surface-white); margin-bottom: 4px; line-height: 1.3; }
    .course-provider { font-size: 11px; color: var(--surface-white); opacity: 0.5; margin-bottom: 10px; }
    .course-desc { font-size: 12px; color: var(--surface-white); opacity: 0.7; line-height: 1.6; margin-bottom: 12px; }
    .course-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 14px; }
    .course-tags span { padding: 2px 8px; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 6px; font-size: 10px; color: var(--surface-white); opacity: 0.6; }
    .progress-section { }
    .progress-label { display: flex; justify-content: space-between; font-size: 11px; color: var(--surface-white); opacity: 0.5; margin-bottom: 6px; }
    .progress-bar { height: 3px; background: var(--glass-border); border-radius: 2px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 2px; transition: width 1s ease; }

    /* GitHub section */
    .github-section { }
    .gh-title {
      font-size: 22px;
      font-weight: 700; color: var(--surface-white); margin-bottom: 24px; text-align: center;
    }
    .gh-link { color: var(--cyan-light); text-decoration: none; }
    .gh-link:hover { text-decoration: underline; }
    .gh-widgets { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    .gh-stat-img { width: 100%; border-radius: 10px; display: block; }
    .gh-streak { margin-bottom: 16px; text-align: center; }
    .gh-streak-img { max-width: 100%; border-radius: 10px; }
    .gh-contrib { margin-bottom: 24px; padding: 16px; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 12px; overflow: hidden; }
    .gh-contrib-img { width: 100%; border-radius: 6px; filter: hue-rotate(120deg); }

    /* Repo cards */
    .gh-repos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .repo-card {
      padding: 16px; border-radius: 12px; text-decoration: none;
      transition: all 0.3s; display: block;
    }
    .repo-card:hover { transform: translateY(-3px); border-color: rgba(0,255,255,0.35); }
    .repo-name { font-size: 13px; font-weight: 700; color: var(--cyan-light); margin-bottom: 6px; }
    .repo-desc { font-size: 11px; color: var(--surface-white); opacity: 0.6; line-height: 1.5; margin-bottom: 10px; }
    .repo-meta { display: flex; gap: 12px; font-size: 10px; color: var(--surface-white); opacity: 0.5; }
    .repo-lang { color: #20bf6b; }

    @media (max-width: 768px) {
      .section { padding: 60px 20px; }
      .courses-grid { grid-template-columns: 1fr; }
      .gh-widgets { grid-template-columns: 1fr; }
      .gh-repos { grid-template-columns: 1fr 1fr; }
    }
  `]
})
export class LearningComponent {
  repos: any[] = [];

  courses: Course[] = [
    {
      title: 'Claude 101',
      provider: 'Anthropic',
      icon: '🤖',
      progress: 65,
      status: 'in-progress',
      color: '#00ffff',
      tags: ['LLMs', 'Prompt Engineering', 'AI Safety'],
      desc: 'Fundamentals of working with Claude — prompting, safety principles, and building AI-native products.'
    },
    {
      title: 'AI Fluency: Framework & Foundations',
      provider: 'AI Academy',
      icon: '🧠',
      progress: 45,
      status: 'in-progress',
      color: '#ff00ff',
      tags: ['AI Concepts', 'ML Basics', 'Frameworks'],
      desc: 'Core AI/ML concepts, neural network foundations, and how modern language models work under the hood.'
    },
    {
      title: 'Advanced Angular Patterns',
      provider: 'Self-study',
      icon: '🔺',
      progress: 100,
      status: 'completed',
      color: '#DD0031',
      tags: ['Angular', 'NgRx', 'Signals', 'SSR'],
      desc: 'Deep dive into Angular v17-v19 signals, standalone components, and enterprise-scale patterns.'
    }
  ];

  constructor(private http: HttpClient) {
    this.loadRepos();
  }

  loadRepos() {
    this.http.get<any[]>('/api/github').subscribe({
      next: (repos) => { this.repos = repos.slice(0, 6); },
      error: () => { }
    });
  }
}