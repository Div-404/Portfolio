import { 
  Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ViewChildren, ElementRef, QueryList 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollService } from '../../services/scroll.service';
import { Subscription } from 'rxjs';
import gsap from 'gsap';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav data-testid="navigation" [class.contact-active]="activePageIndex === 7" #navContainer>
      <div class="nav-logo" (mousemove)="onMouseMoveLogo($event)" (mouseleave)="onMouseLeaveLogo()" #logoEl>SKD</div>
      
      <ul class="nav-links" (mouseleave)="onLinksMouseLeave()">
        <!-- Sliding active glass bubble -->
        <div class="nav-active-bubble" #activeBubble></div>
        
        <li 
          #linkItem 
          *ngFor="let item of navItems" 
          [class.active]="activePageIndex === item.page || (item.aliasPage && activePageIndex === item.aliasPage)"
          (mouseenter)="onLinkMouseEnter(linkItem)"
          (mousemove)="onLinkMouseMove($event, linkItem)">
          <a [href]="item.href">{{ item.name }}</a>
        </li>
      </ul>
      
      <div class="nav-actions">
        <button class="theme-toggle-btn" (click)="toggleTheme()" aria-label="Toggle Theme" #themeBtn>
          <span class="theme-icon">{{ isDarkMode ? '🌙' : '☀️' }}</span>
          <span class="theme-label">{{ isDarkMode ? 'Dark' : 'Light' }}</span>
        </button>
        <a href="#contact" class="nav-cta" (mousemove)="onMouseMoveCta($event)" (mouseleave)="onMouseLeaveCta()" #ctaBtn>Hire Me</a>
      </div>
    </nav>
  `,
  styles: [`
    .theme-toggle-btn {
      background: var(--glass);
      border: 1px solid var(--glass-b);
      border-radius: 50px;
      padding: 0.42rem 0.95rem;
      color: var(--white);
      font-family: var(--font-m);
      font-size: 0.72rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      transition: border-color 0.3s ease, background 0.3s ease;
      outline: none;
    }
    .theme-toggle-btn:hover {
      background: var(--glass-bh);
      border-color: var(--cyan);
      box-shadow: 0 0 12px rgba(0, 122, 153, 0.25);
    }
    .theme-icon {
      display: inline-block;
      font-size: 0.85rem;
    }
  `]
})
export class NavComponent implements OnInit, AfterViewInit, OnDestroy {
  isDarkMode = true;
  activePageIndex = -1;
  isHoveringLinks = false;
  private sub!: Subscription;

  navItems = [
    { name: 'About', href: '#about', page: 1 },
    { name: 'Skills', href: '#skills', page: 2 },
    { name: 'Projects', href: '#projects', page: 3 },
    { name: 'Experience', href: '#experience', page: 4, aliasPage: 5 },
    { name: 'Git Stats', href: '#git-stats', page: 6 },
    { name: 'Contact', href: '#contact', page: 7 }
  ];

  @ViewChild('activeBubble', { static: true }) activeBubble!: ElementRef<HTMLDivElement>;
  @ViewChildren('linkItem', { read: ElementRef }) linkItems!: QueryList<ElementRef<HTMLLIElement>>;
  @ViewChild('themeBtn', { static: true }) themeBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('ctaBtn', { static: true }) ctaBtn!: ElementRef<HTMLAnchorElement>;
  @ViewChild('logoEl', { static: true }) logoEl!: ElementRef<HTMLDivElement>;

  constructor(private scrollService: ScrollService) {}

  ngOnInit() {
    const saved = localStorage.getItem('theme');
    this.isDarkMode = saved !== 'light';
    this.applyTheme();

    this.sub = this.scrollService.activePage$.subscribe(page => {
      this.activePageIndex = page;
      this.updateBubbleToActive();
    });
  }

  ngAfterViewInit() {
    // Timeout ensures angular rendering and styles are completed
    setTimeout(() => {
      this.updateBubbleToActive();
    }, 150);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  updateBubbleToActive() {
    if (this.isHoveringLinks) return;

    const activeItemIdx = this.navItems.findIndex(
      item => this.activePageIndex === item.page || (item.aliasPage && this.activePageIndex === item.aliasPage)
    );

    if (activeItemIdx !== -1 && this.linkItems) {
      const targetLi = this.linkItems.toArray()[activeItemIdx]?.nativeElement;
      if (targetLi) {
        gsap.to(this.activeBubble.nativeElement, {
          left: targetLi.offsetLeft,
          width: targetLi.offsetWidth,
          opacity: 1,
          scale: 1,
          duration: 0.55,
          ease: 'power3.out',
          overwrite: 'auto'
        });
        return;
      }
    }

    // Hide if on Hero (activePageIndex === 0)
    gsap.to(this.activeBubble.nativeElement, {
      opacity: 0,
      scale: 0.8,
      duration: 0.45,
      ease: 'power3.out',
      overwrite: 'auto'
    });
  }

  onLinkMouseEnter(targetLi: HTMLLIElement) {
    this.isHoveringLinks = true;
    gsap.to(this.activeBubble.nativeElement, {
      left: targetLi.offsetLeft,
      width: targetLi.offsetWidth,
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'power3.out',
      overwrite: 'auto'
    });
  }

  onLinkMouseMove(e: MouseEvent, targetLi: HTMLLIElement) {
    const rect = targetLi.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;

    const linkAnchor = targetLi.querySelector('a');
    if (linkAnchor) {
      gsap.to(linkAnchor, {
        x: relX * 0.22,
        y: relY * 0.22,
        duration: 0.2,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }

    gsap.to(this.activeBubble.nativeElement, {
      x: relX * 0.12,
      duration: 0.2,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }

  onLinksMouseLeave() {
    this.isHoveringLinks = false;

    if (this.linkItems) {
      this.linkItems.forEach(item => {
        const anchor = item.nativeElement.querySelector('a');
        if (anchor) {
          gsap.to(anchor, {
            x: 0,
            y: 0,
            duration: 0.4,
            ease: 'elastic.out(1, 0.4)'
          });
        }
      });
    }

    gsap.to(this.activeBubble.nativeElement, {
      x: 0,
      duration: 0.4,
      ease: 'power3.out'
    });

    this.updateBubbleToActive();
  }

  onMouseMoveLogo(e: MouseEvent) {
    const logo = this.logoEl.nativeElement;
    const rect = logo.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    gsap.to(logo, {
      x: relX * 0.35,
      y: relY * 0.35,
      duration: 0.2,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }

  onMouseLeaveLogo() {
    gsap.to(this.logoEl.nativeElement, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)'
    });
  }

  onMouseMoveCta(e: MouseEvent) {
    const cta = this.ctaBtn.nativeElement;
    const rect = cta.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    gsap.to(cta, {
      x: relX * 0.3,
      y: relY * 0.3,
      duration: 0.2,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }

  onMouseLeaveCta() {
    gsap.to(this.ctaBtn.nativeElement, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)'
    });
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();

    const icon = this.themeBtn.nativeElement.querySelector('.theme-icon');
    if (icon) {
      gsap.fromTo(icon, 
        { rotate: 0, scale: 0.5 }, 
        { rotate: 360, scale: 1, duration: 0.65, ease: 'back.out(1.8)' }
      );
    }
  }

  private applyTheme() {
    const body = document.body;
    if (this.isDarkMode) {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
  }
}

