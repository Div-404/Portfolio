import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

/**
 * appReveal — fades + slides an element in once it scrolls into view.
 * Usage: <p appReveal>text</p>  or  <p appReveal [revealDelay]="120">text</p>
 */
@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements OnInit, OnDestroy {
  @Input() revealDelay = 0;
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit() {
    const node = this.el.nativeElement;
    node.classList.add('reveal-init');
    node.style.transitionDelay = `${this.revealDelay}ms`;

    if (!('IntersectionObserver' in window)) {
      node.classList.add('reveal-on');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            node.classList.add('reveal-on');
            this.observer?.unobserve(node);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    this.observer.observe(node);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
