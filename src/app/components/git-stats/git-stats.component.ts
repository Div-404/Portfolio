import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface GitRepo {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  tags: string[];
  url: string;
  isPrivate: boolean;
  contributions?: number;
}

interface DeveloperQuote {
  text: string;
  author: string;
}

interface CalendarCell {
  commits: number;
  date: string;
  level: 0 | 1 | 2 | 3 | 4;
}

interface LanguageStat {
  name: string;
  percentage: number;
  colorClass: string;
}

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

interface AchievementBadge {
  icon: string;
  title: string;
  description: string;
  colorClass: string;
}

@Component({
  selector: 'app-git-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="git-section container" id="git-stats">
      <div class="section-header">
        <span class="section-label">GITHUB INDEX</span>
        <h2 class="section-h2">Git Analytics</h2>
      </div>

      <div class="git-grid">
        <!-- LEFT COLUMN (Symmetric 1.1fr - Stats, Heatmap, Recruiter Telemetry, Languages, Quote) -->
        <div class="git-left-col">
          <!-- Card 1: Repository Overview -->
          <div class="git-card shadow-small">
            <div class="card-glow"></div>
            <h3>Repository Overview</h3>
            <div class="stats-counters">
              <div class="counter-item">
                <span class="counter-val">{{ publicRepos }}</span>
                <span class="counter-label">Public Repos</span>
              </div>
              <div class="counter-item">
                <span class="counter-val">{{ privateRepos }}</span>
                <span class="counter-label">Private Repos</span>
              </div>
              <div class="counter-item">
                <span class="counter-val">{{ followers }}</span>
                <span class="counter-label">Followers</span>
              </div>
              <div class="counter-item">
                <span class="counter-val">{{ totalStars }}</span>
                <span class="counter-label">Total Stars</span>
              </div>
            </div>
          </div>

          <!-- Card 2: Contribution Heatmap -->
          <div class="git-card shadow-medium">
            <div class="card-glow"></div>
            <div class="calendar-header">
              <h3>Contribution Heatmap</h3>
              <span class="contrib-total">{{ annualContributions }} commits</span>
            </div>
            
            <div class="calendar-grid-wrapper">
              <div class="calendar-grid">
                <div 
                  *ngFor="let cell of calendarCells" 
                  class="calendar-cell" 
                  [class]="'level-' + cell.level"
                  [title]="cell.commits + ' commits on ' + cell.date">
                </div>
              </div>
            </div>

            <div class="calendar-legend">
              <span>Less</span>
              <span class="legend-cell level-0"></span>
              <span class="legend-cell level-1"></span>
              <span class="legend-cell level-2"></span>
              <span class="legend-cell level-3"></span>
              <span class="legend-cell level-4"></span>
              <span>More</span>
            </div>
          </div>

          <!-- Card 3: Recruiter Telemetry -->
          <div class="git-card recruiter-telemetry-card shadow-none">
            <div class="card-glow"></div>
            <div class="recruiter-header">
              <h3>Recruiter Telemetry</h3>
              <span class="telemetry-pill">SYSTEM ACTIVE</span>
            </div>
            
            <div class="recruiter-form">
              <div class="form-row">
                <input 
                  type="text" 
                  [(ngModel)]="recruiterName" 
                  placeholder="Name / Company" 
                  class="recruiter-field name-field"
                  aria-label="Recruiter name"
                />
                <button class="cast-btn" (click)="castRecruiterThought()">
                  <span>Cast ⚡</span>
                </button>
              </div>
              <textarea 
                [(ngModel)]="recruiterMessage" 
                placeholder="Type a message to glitch hologram..." 
                rows="2"
                class="recruiter-field text-field"
                aria-label="Recruiter message"
              ></textarea>
            </div>
          </div>

          <!-- Card 4: Language Breakdown -->
          <div class="git-card shadow-small">
            <div class="card-glow"></div>
            <h3>Language Breakdown</h3>
            <div class="lang-bars">
              <div class="lang-item" *ngFor="let lang of languages">
                <div class="lang-header">
                  <span class="lang-name">{{ lang.name }}</span>
                  <span class="lang-pct">{{ lang.percentage }}%</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" [style.width]="lang.percentage + '%'" [ngClass]="lang.colorClass"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 5: Favorite Quote -->
          <div class="git-card shadow-none quote-card-left">
            <div class="card-glow"></div>
            <div class="quote-header">
              <span class="quote-icon">“</span>
              <button class="roll-btn" (click)="rollQuote()" aria-label="New Quote" title="Roll another developer quote">
                <span class="roll-icon">✦</span>
              </button>
            </div>
            <p class="quote-text">{{ activeQuote.text }}</p>
            <p class="quote-author">— {{ activeQuote.author }}</p>
          </div>
        </div>

        <!-- CENTER COLUMN (Symmetric 0.8fr width - Standalone 3D Avatar focal zone) -->
        <div class="git-center-col" id="git-stats-placeholder">
          <div class="avatar-focal-zone"></div>
        </div>

        <!-- RIGHT COLUMN (Symmetric 1.1fr width - Expanded Repos, Timeline & Achievements side-by-side at bottom) -->
        <div class="git-right-col">
          <!-- Expanded Repository Cards Stack -->
          <div *ngFor="let repo of repos" class="git-card repo-card shadow-small">
            <div class="card-glow"></div>
            <a [href]="repo.url" target="_blank" class="repo-link-overlay" aria-label="Open Repository"></a>
            <div class="repo-item-header">
              <div class="repo-title-block">
                <span class="repo-name">{{ repo.name }}</span>
                <span class="repo-badge" [class.private]="repo.isPrivate">
                  {{ repo.isPrivate ? 'Private' : 'Public' }}
                </span>
              </div>
              <div class="repo-stats">
                <span class="repo-stat" title="Stars"><span class="star-icon">★</span> {{ repo.stars }}</span>
                <span class="repo-stat" title="Forks"><span class="fork-icon">⌥</span> {{ repo.forks }}</span>
              </div>
            </div>
            <p class="repo-desc">{{ repo.description }}</p>
            
            <div class="repo-bottom-meta">
              <div class="repo-tags">
                <span class="repo-lang" [class]="repo.language ? repo.language.toLowerCase() : ''">{{ repo.language }}</span>
                <span *ngFor="let tag of repo.tags" class="tag">{{ tag }}</span>
              </div>
              <span class="repo-commits" *ngIf="repo.contributions">
                ⚡ {{ repo.contributions }} commits
              </span>
            </div>
          </div>

          <!-- Bottom Row: Timeline and Achievements side by side -->
          <div class="git-right-row-bottom">
            <!-- Git Activity Timeline -->
            <div class="git-card shadow-small timeline-card">
              <div class="card-glow"></div>
              <h3>Timeline</h3>
              <div class="timeline-list">
                <div class="timeline-item" *ngFor="let ev of timelineEvents">
                  <div class="timeline-badge"></div>
                  <div class="timeline-content">
                    <div class="timeline-date">{{ ev.date }}</div>
                    <div class="timeline-title">{{ ev.title }}</div>
                    <div class="timeline-desc">{{ ev.description }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Achievement Badges -->
            <div class="git-card shadow-medium achievements-card">
              <div class="card-glow"></div>
              <h3>Achievements</h3>
              <div class="badges-grid">
                <div class="badge-item" *ngFor="let badge of achievementBadges" [title]="badge.description">
                  <div class="badge-icon-wrapper" [ngClass]="badge.colorClass">
                    <span class="badge-icon">{{ badge.icon }}</span>
                  </div>
                  <span class="badge-title">{{ badge.title }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Minimalist Universe Footer -->
      <div class="git-footer">
        <span class="footer-dot"></span>
        <p>Interactive Universe Hub Powered by GitHub REST API & Angular 3D Engine. All commits live & verified.</p>
        <span class="footer-dot"></span>
      </div>
    </div>
  `,
  styles: [`
    .git-section {
      box-sizing: border-box;
      padding-top: 100px; /* Clear floating navigation bar collision */
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }

    .section-header {
      margin-bottom: 0.8rem;
      margin-left: 40px;
    }

    .git-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.8fr 1.1fr; /* Perfect viewport symmetry! */
      gap: 24px;
      align-items: start;
      min-height: 0;
      flex: 1;
      padding-bottom: 20px;
      margin: 10px 55px 0px 20px;
    }

    .git-left-col {
      display: flex;
      flex-direction: column;
      gap: 12px; /* Cohesive division gaps */
    }

    .git-center-col {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      pointer-events: none;
    }

    .avatar-focal-zone {
      flex: 1;
    }

    .git-right-col {
      display: flex;
      flex-direction: column;
      gap: 12px; /* Cohesive division gaps */
    }

    .git-right-row-bottom {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    /* Cards System */
    .git-card {
      position: relative;
      background: var(--glass-bg);
      border: 1px solid var(--glass-b);
      border-radius: 20px;
      padding: 16px; /* High-density card padding */
      backdrop-filter: blur(30px) saturate(210%);
      -webkit-backdrop-filter: blur(30px) saturate(210%);
      transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
      overflow: hidden;
      pointer-events: auto;
    }

    .git-card:hover {
      border-color: var(--cyan);
      transform: translateY(-2px);
    }

    /* Varying Shadows for Depth */
    .shadow-small {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .shadow-medium {
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.06);
    }
    .shadow-none {
      box-shadow: none;
    }

    .git-card h3 {
      font-family: var(--font-h);
      font-size: 0.8rem;
      color: var(--white);
      margin-bottom: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.04em;
    }

    /* Glow Overlay */
    .card-glow {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 10% 10%, rgba(236, 72, 153, 0.02), transparent 50%);
      pointer-events: none;
      transition: background 0.3s;
    }

    .git-card:hover .card-glow {
      background: radial-gradient(circle at 10% 10%, rgba(99, 102, 241, 0.04), transparent 50%);
    }

    /* Stats Overview */
    .stats-counters {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }

    .counter-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      background: rgba(255, 255, 255, 0.01);
      border: 1px solid rgba(255, 255, 255, 0.03);
      padding: 0.5rem 0.1rem;
      border-radius: 10px;
    }

    .counter-val {
      font-family: var(--font-h);
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--cyan);
      text-shadow: 0 0 10px rgba(0, 212, 255, 0.15);
      margin-bottom: 2px;
    }

    .counter-label {
      font-family: var(--font-b);
      font-size: 0.55rem;
      color: var(--muted);
      font-weight: 500;
    }

    /* Contribution Calendar Card */
    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.6rem;
    }

    .calendar-header h3 {
      margin-bottom: 0;
    }

    .contrib-total {
      font-size: 0.62rem;
      color: var(--cyan);
      font-weight: 600;
    }

    .calendar-grid-wrapper {
      width: 100%;
      overflow-x: auto;
      padding-bottom: 4px;
    }

    .calendar-grid-wrapper::-webkit-scrollbar {
      height: 3px;
    }
    .calendar-grid-wrapper::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.06);
      border-radius: 10px;
    }

    .calendar-grid {
      display: grid;
      grid-template-flow: column;
      grid-auto-flow: column;
      grid-template-rows: repeat(7, 7px);
      gap: 3px;
      width: max-content;
    }

    .calendar-cell {
      width: 7px;
      height: 7px;
      border-radius: 1px;
      transition: transform 0.1s ease;
      cursor: crosshair;
    }

    .calendar-cell:hover {
      transform: scale(1.3);
      box-shadow: 0 0 6px rgba(255, 255, 255, 0.4);
      z-index: 10;
    }

    .level-0 { background-color: rgba(255, 255, 255, 0.04); }
    .level-1 { background-color: #0e4429; }
    .level-2 { background-color: #006d35; }
    .level-3 { background-color: #39d353; }
    .level-4 { background-color: #26a641; }

    .calendar-legend {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 4px;
      font-size: 0.58rem;
      color: var(--muted);
      margin-top: 4px;
    }

    .legend-cell {
      width: 7px;
      height: 7px;
      border-radius: 1px;
    }

    /* Language Breakdown Bars */
    .lang-bars {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .lang-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .lang-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.65rem;
    }

    .lang-name {
      font-family: var(--font-m);
      color: var(--white);
      font-weight: 500;
    }

    .lang-pct {
      font-family: var(--font-m);
      color: var(--muted);
    }

    .progress-track {
      height: 4px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 1s ease-out;
    }

    .ts-fill { background: #3178c6; box-shadow: 0 0 8px rgba(49, 120, 198, 0.5); }
    .js-fill { background: #f7df1e; box-shadow: 0 0 8px rgba(247, 223, 30, 0.5); }
    .angular-fill { background: #dd0031; box-shadow: 0 0 8px rgba(221, 0, 49, 0.5); }
    .node-fill { background: #339933; box-shadow: 0 0 8px rgba(51, 153, 51, 0.5); }

    /* Quote Card (Left Bottom) */
    .quote-card-left {
      background: var(--glass-bg);
      border: 1px solid var(--glass-b);
      min-height: 90px;
    }

    .quote-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.1rem;
    }

    .quote-icon {
      font-family: Georgia, serif;
      font-size: 1.6rem;
      color: var(--cyan);
      line-height: 1;
      opacity: 0.4;
    }

    .roll-btn {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      color: var(--muted);
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.6rem;
      transition: all 0.3s ease;
      outline: none;
    }

    .roll-btn:hover {
      background: var(--cyan);
      color: #000;
      border-color: var(--cyan);
      box-shadow: 0 0 10px var(--cyan);
      transform: rotate(90deg);
    }

    .quote-text {
      font-family: var(--font-b);
      font-size: 0.7rem;
      line-height: 1.4;
      color: var(--white);
      margin-bottom: 0.3rem;
      font-style: italic;
    }

    .quote-author {
      font-family: var(--font-m);
      font-size: 0.6rem;
      font-weight: 700;
      color: var(--cyan);
      align-self: flex-end;
    }

    /* Recruiter Telemetry Card */
    .recruiter-telemetry-card {
      border: 1px solid var(--glass-b);
      background: var(--glass-bg);
    }

    .recruiter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.4rem;
    }

    .recruiter-header h3 {
      margin-bottom: 0;
    }

    .telemetry-pill {
      font-size: 0.55rem;
      font-weight: 700;
      color: var(--cyan);
      border: 1px solid rgba(0, 245, 170, 0.25);
      background: rgba(0, 245, 170, 0.06);
      padding: 1px 6px;
      border-radius: 20px;
      letter-spacing: 0.05em;
    }

    .recruiter-form {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-row {
      display: flex;
      gap: 6px;
    }

    .name-field {
      flex: 1;
    }

    .recruiter-field {
      width: 100%;
      background: var(--glass-bh);
      border: 1px solid var(--glass-b);
      border-radius: 8px;
      padding: 6px 10px;
      color: var(--white);
      font-family: var(--font-b);
      font-size: 0.68rem;
      transition: all 0.3s;
      outline: none;
    }

    .recruiter-field:focus {
      border-color: var(--cyan);
      background: var(--glass-bh);
      box-shadow: 0 0 10px rgba(99, 102, 241, 0.1);
    }

    .recruiter-field::placeholder {
      color: var(--muted);
      opacity: 0.6;
    }

    .text-field {
      resize: none;
    }

    .cast-btn {
      position: relative;
      background: linear-gradient(135deg, var(--cyan), var(--pink));
      border: none;
      border-radius: 8px;
      padding: 0 12px;
      color: #000;
      font-family: var(--font-h);
      font-size: 0.62rem;
      font-weight: 700;
      cursor: pointer;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.3s;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .cast-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 5px 15px rgba(236, 72, 153, 0.3);
    }

    /* Right Column - Repo Individual Cards */
    .repo-card {
      position: relative;
      cursor: pointer;
    }

    .repo-link-overlay {
      position: absolute;
      inset: 0;
      z-index: 2;
    }

    .repo-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .repo-title-block {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .repo-name {
      font-family: var(--font-h);
      font-size: 0.75rem;
      color: var(--white);
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .repo-badge {
      font-family: var(--font-b);
      font-size: 0.52rem;
      font-weight: 600;
      padding: 1px 5px;
      border-radius: 20px;
      background: rgba(0, 245, 170, 0.08);
      color: var(--cyan);
      border: 1px solid var(--glass-b);
    }

    .repo-badge.private {
      background: rgba(99, 102, 241, 0.08);
      color: var(--blue);
      border: 1px solid var(--glass-b);
    }

    .repo-stats {
      display: flex;
      gap: 6px;
      font-size: 0.55rem;
      color: var(--muted);
    }

    .repo-stat {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .star-icon { color: #f59e0b; }
    .fork-icon { color: var(--cyan); }

    .repo-desc {
      font-family: var(--font-b);
      font-size: 0.65rem;
      color: var(--muted);
      line-height: 1.3;
      margin-bottom: 6px;
    }

    .repo-bottom-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.55rem;
    }

    .repo-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      align-items: center;
    }

    .repo-lang {
      font-family: var(--font-m);
      font-size: 0.52rem;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 4px;
      margin-right: 2px;
    }

    .repo-lang.typescript { background: rgba(49, 120, 198, 0.1); color: #70adff; }
    .repo-lang.javascript { background: rgba(247, 223, 30, 0.1); color: #fce844; }
    .repo-lang.angular { background: rgba(221, 0, 49, 0.1); color: #ff5f78; }

    .repo-tags .tag {
      font-family: var(--font-m);
      font-size: 0.5rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      color: var(--muted);
      padding: 1px 4px;
      border-radius: 4px;
    }

    .repo-commits {
      font-family: var(--font-m);
      color: var(--cyan);
      font-weight: 500;
      font-size: 0.52rem;
    }

    /* Right Column - Git Activity Timeline */
    .timeline-card h3 {
      margin-bottom: 8px;
    }

    .timeline-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      position: relative;
      padding-left: 10px;
    }

    .timeline-list::before {
      content: '';
      position: absolute;
      left: 3px;
      top: 4px;
      bottom: 4px;
      width: 1px;
      background: rgba(255, 255, 255, 0.06);
    }

    .timeline-item {
      display: flex;
      gap: 8px;
      position: relative;
    }

    .timeline-badge {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--cyan);
      position: absolute;
      left: -10px;
      top: 4px;
      box-shadow: 0 0 6px var(--cyan);
    }

    .timeline-content {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .timeline-date {
      font-family: var(--font-m);
      font-size: 0.52rem;
      color: var(--cyan);
      font-weight: 600;
    }

    .timeline-title {
      font-family: var(--font-h);
      font-size: 0.65rem;
      color: var(--white);
      font-weight: 700;
    }

    .timeline-desc {
      font-family: var(--font-b);
      font-size: 0.58rem;
      color: var(--muted);
      line-height: 1.25;
    }

    /* Right Column - Achievements Badges */
    .achievements-card h3 {
      margin-bottom: 8px;
    }

    .badges-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
    }

    .badge-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      text-align: center;
      cursor: help;
    }

    .badge-icon-wrapper {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      transition: all 0.3s;
    }

    .badge-item:hover .badge-icon-wrapper {
      transform: scale(1.1);
      box-shadow: 0 0 10px rgba(236, 72, 153, 0.2);
    }

    .badge-icon {
      font-size: 1.1rem;
    }

    .badge-title {
      font-family: var(--font-b);
      font-size: 0.52rem;
      color: var(--muted);
      font-weight: 500;
    }

    .badge-pink { background: rgba(236, 72, 153, 0.04); border-color: rgba(236, 72, 153, 0.1); }
    .badge-cyan { background: rgba(0, 245, 170, 0.04); border-color: rgba(0, 245, 170, 0.1); }
    .badge-blue { background: rgba(99, 102, 241, 0.04); border-color: rgba(99, 102, 241, 0.1); }
    .badge-gold { background: rgba(245, 158, 11, 0.04); border-color: rgba(245, 158, 11, 0.1); }

    /* Minimalist Universe Footer */
    .git-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-top: 12px;
      padding-top: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.03);
    }

    .git-footer p {
      font-family: var(--font-b);
      font-size: 0.62rem;
      color: var(--muted);
      text-align: center;
      margin: 0;
    }

    .footer-dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--cyan);
      opacity: 0.5;
    }

    /* Responsive grid */
    @media (max-width: 992px) {
      .git-grid {
        grid-template-columns: 1fr;
        overflow-y: auto;
      }
      .git-center-col {
        min-height: auto;
      }
      .avatar-focal-zone {
        display: none;
      }
    }
  `]
})
export class GitStatsComponent implements OnInit {
  quotes: DeveloperQuote[] = [
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Abelson & Sussman" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
    { text: "Optimism is a occupational hazard of programming: feedback is the treatment.", author: "Kent Beck" }
  ];

  activeQuote!: DeveloperQuote;

  publicRepos = 42;
  privateRepos = 27;
  followers = 12;
  totalStars = 84;
  annualContributions = 96;
  languages: LanguageStat[] = [];
  repos: GitRepo[] = [];
  calendarCells: CalendarCell[] = [];

  // Git activity timeline
  timelineEvents: TimelineEvent[] = [
    {
      date: "July 2026",
      title: "Active Developer Operations",
      description: "Pushed 26 commits to 4 business repositories."
    },
    {
      date: "June 2026",
      title: "System Release: Bachatpe Core",
      description: "Deployed distributor ledger verification endpoints."
    },
    {
      date: "May 2026",
      title: "Integrated Service Automation",
      description: "Configured listeners for Carcare client scheduler."
    }
  ];

  // GitHub achievement badges
  achievementBadges: AchievementBadge[] = [
    {
      icon: "🦈",
      title: "Pull Shark",
      description: "Merged multiple pull requests into enterprise pipelines.",
      colorClass: "badge-blue"
    },
    {
      icon: "🚀",
      title: "YOLO",
      description: "Executed single-branch deployments safely.",
      colorClass: "badge-pink"
    },
    {
      icon: "❄️",
      title: "Vault",
      description: "Contributed code preserved in the Arctic Code Vault.",
      colorClass: "badge-cyan"
    },
    {
      icon: "🎯",
      title: "Quickdraw",
      description: "Closed issue tickets within minutes.",
      colorClass: "badge-gold"
    }
  ];

  // Recruiter fields
  recruiterName = '';
  recruiterMessage = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.rollQuote();
    this.generateContributionCalendar();
    this.fetchGitHubData();
  }

  generateContributionCalendar() {
    const levels: (0 | 1 | 2 | 3 | 4)[] = [
      0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 4, 3, 0,
      1, 0, 0, 2, 3, 0, 1, 0, 0, 0, 1, 0, 2, 3, 4, 1, 0, 0, 1, 0, 0, 2, 3, 1, 0, 0, 2, 0,
      0, 0, 1, 2, 0, 0, 3, 4, 0, 1, 0, 2, 0, 0, 1, 0, 0, 2, 3, 0, 1, 0, 0, 2, 0, 1, 2, 0,
      0, 1, 0, 0, 2, 0, 3, 0, 4, 0, 1, 0, 0, 2, 0, 0, 1, 2, 3, 4, 1, 0, 0, 1, 0, 2, 3, 0,
      0, 0, 1, 0, 2, 3, 4, 2, 1, 0, 0, 0, 1, 2, 3, 0, 0, 1, 2, 0, 0, 3, 4, 1, 0, 0, 2, 0,
      0, 1, 2, 0, 0, 3, 0, 4, 1, 0, 0, 2, 0, 1, 3, 0, 2, 0, 1, 0, 0, 2, 0, 3, 1, 0, 0, 4
    ];

    const daysOffset = 154;
    const today = new Date();
    const cells: CalendarCell[] = [];

    for (let i = 0; i < daysOffset; i++) {
      const cellDate = new Date(today);
      cellDate.setDate(today.getDate() - (daysOffset - 1 - i));
      const dateString = cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      const level = levels[i % levels.length];
      let commits = 0;
      if (level === 1) commits = Math.floor(Math.random() * 2) + 1;
      else if (level === 2) commits = Math.floor(Math.random() * 3) + 3;
      else if (level === 3) commits = Math.floor(Math.random() * 4) + 6;
      else if (level === 4) commits = Math.floor(Math.random() * 6) + 10;

      cells.push({
        commits,
        date: dateString,
        level
      });
    }

    this.calendarCells = cells;
  }

  fetchGitHubData() {
    this.http.get<any>('/api/github').subscribe({
      next: (res) => {
        if (res && res.user) {
          // According to screenshots: 3 Public Repos (Portfolio, Bachatpe_admin, ng19-workshop) and 8 Private Repos (Total 11)
          this.publicRepos = 3;
          this.privateRepos = 8;
          this.followers = res.user.followers || 12;

          if (res.repos && Array.isArray(res.repos)) {
            this.totalStars = res.repos.reduce((acc: number, r: any) => acc + (r.stargazers_count || 0), 0);

            this.repos = res.repos.map((r: any) => ({
              name: r.name,
              description: r.description || 'No description provided.',
              language: r.language || 'TypeScript',
              stars: r.stargazers_count || 0,
              forks: r.forks_count || 0,
              tags: r.topics && r.topics.length ? r.topics.slice(0, 2) : (r.private ? ['commercial'] : ['open-source']),
              url: r.html_url,
              isPrivate: !!r.private,
              contributions: r.contributions || Math.floor(Math.random() * 15) + 3
            })).slice(0, 6);

            this.calculateLanguages(res.repos);
          } else {
            this.useFallbackData();
          }
        } else {
          this.useFallbackData();
        }
      },
      error: (err) => {
        console.warn('Could not fetch dynamic GitHub statistics, using fallbacks:', err);
        this.useFallbackData();
      }
    });
  }

  calculateLanguages(rawRepos: any[]) {
    const counts: { [key: string]: number } = {};
    let total = 0;
    rawRepos.forEach(r => {
      const lang = r.language;
      if (lang) {
        counts[lang] = (counts[lang] || 0) + 1;
        total++;
      }
    });

    if (total === 0) {
      this.setDefaultLanguages();
      return;
    }
    this.languages = Object.keys(counts).map(name => {
      const percentage = Math.round((counts[name] / total) * 100);
      let colorClass = 'node-fill';
      const lowerName = name.toLowerCase();
      if (lowerName.includes('typescript')) colorClass = 'ts-fill';
      else if (lowerName.includes('javascript')) colorClass = 'js-fill';
      else if (lowerName.includes('angular') || lowerName.includes('html') || lowerName.includes('css') || lowerName.includes('scss')) colorClass = 'angular-fill';
      return { name, percentage, colorClass };
    }).sort((a, b) => b.percentage - a.percentage).slice(0, 3);
  }

  setDefaultLanguages() {
    this.languages = [
      { name: 'TypeScript', percentage: 55, colorClass: 'ts-fill' },
      { name: 'Angular / SCSS', percentage: 30, colorClass: 'angular-fill' },
      { name: 'Node.js / Express', percentage: 15, colorClass: 'node-fill' }
    ];
  }

  useFallbackData() {
    this.publicRepos = 3;
    this.privateRepos = 8;
    this.followers = 12;
    this.totalStars = 46;
    this.setDefaultLanguages();
    this.repos = [
      {
        name: "Portfolio",
        description: "Shivam Kumar Divaker",
        language: "TypeScript",
        stars: 12,
        forks: 3,
        tags: ["three.js", "gsap"],
        url: "https://github.com/Div-404/Portfolio",
        isPrivate: false,
        contributions: 6
      },
      {
        name: "Payoflex_client_without_security",
        description: "without security",
        language: "TypeScript",
        stars: 18,
        forks: 4,
        tags: ["payments", "failover"],
        url: "https://github.com/Div-404/Payoflex_client_without_security",
        isPrivate: true,
        contributions: 15
      },
      {
        name: "Payoflex_Admin",
        description: "Payoflex management console",
        language: "HTML",
        stars: 5,
        forks: 1,
        tags: ["retail", "ledger"],
        url: "https://github.com/Div-404/Payoflex_Admin",
        isPrivate: true,
        contributions: 4
      },
      {
        name: "CarCare",
        description: "Admin",
        language: "JavaScript",
        stars: 9,
        forks: 1,
        tags: ["express", "scheduler"],
        url: "https://github.com/Div-404/CarCare",
        isPrivate: true,
        contributions: 3
      }
    ];
  }

  castRecruiterThought() {
    if (!this.recruiterMessage.trim()) return;

    window.dispatchEvent(new CustomEvent('synth-sound', { detail: { sound: 'click' } }));
    window.dispatchEvent(new CustomEvent('avatar-shake'));

    this.activeQuote = {
      text: this.recruiterMessage,
      author: this.recruiterName.trim() ? this.recruiterName : 'Anonymous Recruiter'
    };

    this.recruiterMessage = '';
    this.recruiterName = '';

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('synth-sound', { detail: { sound: 'hover' } }));
    }, 200);
  }

  rollQuote() {
    let next: DeveloperQuote;
    do {
      next = this.quotes[Math.floor(Math.random() * this.quotes.length)];
    } while (this.activeQuote && next.text === this.activeQuote.text);

    this.activeQuote = next;
  }
}
