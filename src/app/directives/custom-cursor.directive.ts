import { 
  Directive, 
  ElementRef, 
  OnInit, 
  OnDestroy,
  Renderer2,
  Inject,
  PLATFORM_ID,
  Input
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appCustomCursor]',
  standalone: true
})
export class CustomCursorDirective implements OnInit, OnDestroy {
  @Input() cursorText = '';
  @Input() cursorType: 'default' | 'view' | 'click' = 'default';

  private dot: HTMLDivElement | null = null;
  private ring: HTMLDivElement | null = null;
  private textEl: HTMLSpanElement | null = null;
  
  private mouseX = 0;
  private mouseY = 0;
  private dotX = 0;
  private dotY = 0;
  private ringX = 0;
  private ringY = 0;
  private animationId: number | null = null;
  private isBrowser: boolean;
  private isHovering = false;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.createCursorElements();
    this.addEventListeners();
    this.animate();
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    this.removeEventListeners();
    this.cleanup();
  }

  private createCursorElements(): void {
    const cursorContainer = document.createElement('div');
    cursorContainer.className = 'custom-cursor-container';
    cursorContainer.innerHTML = `
      <div class="cursor-dot"></div>
      <div class="cursor-ring">
        <span class="cursor-text"></span>
      </div>
    `;
    document.body.appendChild(cursorContainer);
    
    this.dot = cursorContainer.querySelector('.cursor-dot') as HTMLDivElement;
    this.ring = cursorContainer.querySelector('.cursor-ring') as HTMLDivElement;
    this.textEl = cursorContainer.querySelector('.cursor-text') as HTMLSpanElement;
    
    this.renderer.addClass(document.body, 'custom-cursor-active');
  }

  private addEventListeners(): void {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseenter', this.onMouseEnter);
    document.addEventListener('mouseleave', this.onMouseLeave);
    
    const interactiveElements = document.querySelectorAll('a, button, [appMagneticButton], [appCardTilt], .project-card, mat-card, .nav-links button');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', this.onElementHover);
      el.addEventListener('mouseleave', this.onElementLeave);
    });
    
    document.addEventListener('DOMContentLoaded', () => {
      this.attachHoverListeners();
    });
  }

  private attachHoverListeners(): void {
    const interactiveElements = document.querySelectorAll('a, button, [appMagneticButton], [appCardTilt], .project-card, mat-card, .nav-links button');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', this.onElementHover);
      el.addEventListener('mouseleave', this.onElementLeave);
    });
  }

  private removeEventListeners(): void {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseenter', this.onMouseEnter);
    document.removeEventListener('mouseleave', this.onMouseLeave);
  }

  private onMouseMove = (event: MouseEvent): void => {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  };

  private onMouseEnter = (): void => {
    if (this.dot && this.ring) {
      this.dot.style.opacity = '1';
      this.ring.style.opacity = '1';
    }
  };

  private onMouseLeave = (): void => {
    if (this.dot && this.ring) {
      this.dot.style.opacity = '0';
      this.ring.style.opacity = '0';
    }
  };

  private onElementHover = (): void => {
    this.isHovering = true;
    if (this.ring) {
      this.ring.classList.add('cursor-hover');
    }
    if (this.cursorText && this.textEl) {
      this.textEl.textContent = this.cursorText;
      this.textEl.classList.add('visible');
    }
  };

  private onElementLeave = (): void => {
    this.isHovering = false;
    if (this.ring) {
      this.ring.classList.remove('cursor-hover');
    }
    if (this.textEl) {
      this.textEl.classList.remove('visible');
    }
  };

  private animate = (): void => {
    this.dotX += (this.mouseX - this.dotX) * 0.2;
    this.dotY += (this.mouseY - this.dotY) * 0.2;
    this.ringX += (this.mouseX - this.ringX) * 0.15;
    this.ringY += (this.mouseY - this.ringY) * 0.15;

    if (this.dot) {
      this.dot.style.transform = `translate(${this.dotX}px, ${this.dotY}px)`;
    }
    if (this.ring) {
      this.ring.style.transform = `translate(${this.ringX}px, ${this.ringY}px)`;
    }

    this.animationId = requestAnimationFrame(this.animate);
  };

  private cleanup(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.dot?.parentElement) {
      this.dot.parentElement.remove();
    }
    this.renderer.removeClass(document.body, 'custom-cursor-active');
  }
}

@Directive({
  selector: '[appCursorText]',
  standalone: true
})
export class CursorTextDirective {
  @Input() appCursorText = '';

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.el.nativeElement.addEventListener('mouseenter', () => {
      const textEl = document.querySelector('.cursor-text') as HTMLElement;
      if (textEl && this.appCursorText) {
        textEl.textContent = this.appCursorText;
        textEl.classList.add('visible');
      }
    });
    
    this.el.nativeElement.addEventListener('mouseleave', () => {
      const textEl = document.querySelector('.cursor-text') as HTMLElement;
      if (textEl) {
        textEl.classList.remove('visible');
      }
    });
  }
}
