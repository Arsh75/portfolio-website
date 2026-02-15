import { 
  Directive, 
  ElementRef, 
  Input, 
  OnInit, 
  OnDestroy,
  Renderer2,
  HostListener,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface TiltPosition {
  x: number;
  y: number;
}

@Directive({
  selector: '[appCardTilt]',
  standalone: true
})
export class CardTiltDirective implements OnInit, OnDestroy {
  @Input() maxTilt = 15;
  @Input() perspective = 1000;
  @Input() speed = 0.3;
  @Input() enableGlow = true;

  private rect!: DOMRect;
  private centerX = 0;
  private centerY = 0;
  private targetRotateX = 0;
  private targetRotateY = 0;
  private currentRotateX = 0;
  private currentRotateY = 0;
  private animationId: number | null = null;
  private isBrowser: boolean;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.updateRect();
    this.renderer.setStyle(this.el.nativeElement, 'will-change', 'transform');
    this.renderer.setStyle(this.el.nativeElement, 'transform-style', 'preserve-3d');
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.isBrowser) return;
    this.updateRect();
    this.centerX = this.rect.left + this.rect.width / 2;
    this.centerY = this.rect.top + this.rect.height / 2;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (!this.isBrowser) return;
    this.targetRotateX = 0;
    this.targetRotateY = 0;
    this.animateToOrigin();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isBrowser) return;
    
    this.centerX = this.rect.left + this.rect.width / 2;
    this.centerY = this.rect.top + this.rect.height / 2;

    const deltaX = event.clientX - this.centerX;
    const deltaY = event.clientY - this.centerY;

    const rotateY = (deltaX / (this.rect.width / 2)) * this.maxTilt;
    const rotateX = -(deltaY / (this.rect.height / 2)) * this.maxTilt;

    this.targetRotateX = rotateX;
    this.targetRotateY = rotateY;

    if (this.enableGlow) {
      this.updateGlow(event.clientX, event.clientY);
    }

    this.animate();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateRect();
  }

  private updateRect(): void {
    this.rect = this.el.nativeElement.getBoundingClientRect();
  }

  private updateGlow(clientX: number, clientY: number): void {
    const glowElement = this.el.nativeElement.querySelector('.tilt-glow') as HTMLElement;
    if (glowElement) {
      const x = clientX - this.rect.left;
      const y = clientY - this.rect.top;
      glowElement.style.background = `radial-gradient(
        circle at ${x}px ${y}px,
        rgba(var(--primary-rgb), 0.15) 0%,
        rgba(var(--accent-color), 0.08) 30%,
        transparent 70%
      )`;
    }
  }

  private animate(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    const lerp = (start: number, end: number, factor: number): number => {
      return start + (end - start) * factor;
    };

    const animateFrame = () => {
      this.currentRotateX = lerp(this.currentRotateX, this.targetRotateX, this.speed);
      this.currentRotateY = lerp(this.currentRotateY, this.targetRotateY, this.speed);

      this.renderer.setStyle(
        this.el.nativeElement,
        'transform',
        `perspective(${this.perspective}px) rotateX(${this.currentRotateX}deg) rotateY(${this.currentRotateY}deg)`
      );

      this.updateShadow();

      if (Math.abs(this.targetRotateX - this.currentRotateX) > 0.01 || 
          Math.abs(this.targetRotateY - this.currentRotateY) > 0.01) {
        this.animationId = requestAnimationFrame(animateFrame);
      }
    };

    this.animationId = requestAnimationFrame(animateFrame);
  }

  private updateShadow(): void {
    const rotateX = this.currentRotateX;
    const rotateY = this.currentRotateY;
    
    const shadowX = rotateY * 2;
    const shadowY = -rotateX * 2;
    const shadowBlur = 40 + Math.abs(rotateX) + Math.abs(rotateY);
    const shadowOpacity = 0.3 + (Math.abs(rotateX) + Math.abs(rotateY)) / 100;

    const glowElement = this.el.nativeElement.querySelector('.tilt-glow') as HTMLElement;
    if (glowElement) {
      this.renderer.setStyle(glowElement, 'opacity', '1');
    }
  }

  private animateToOrigin(): void {
    const lerp = (start: number, end: number, factor: number): number => {
      return start + (end - start) * factor;
    };

    const animateFrame = () => {
      this.currentRotateX = lerp(this.currentRotateX, 0, 0.15);
      this.currentRotateY = lerp(this.currentRotateY, 0, 0.15);

      this.renderer.setStyle(
        this.el.nativeElement,
        'transform',
        `perspective(${this.perspective}px) rotateX(${this.currentRotateX}deg) rotateY(${this.currentRotateY}deg)`
      );

      const glowElement = this.el.nativeElement.querySelector('.tilt-glow') as HTMLElement;
      if (glowElement) {
        this.renderer.setStyle(glowElement, 'opacity', '0');
      }

      if (Math.abs(this.currentRotateX) > 0.01 || Math.abs(this.currentRotateY) > 0.01) {
        this.animationId = requestAnimationFrame(animateFrame);
      } else {
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'perspective(1000px) rotateX(0) rotateY(0)');
      }
    };

    this.animationId = requestAnimationFrame(animateFrame);
  }
}
