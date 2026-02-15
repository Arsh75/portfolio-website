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

@Directive({
  selector: '[appMagneticButton]',
  standalone: true
})
export class MagneticButtonDirective implements OnInit, OnDestroy {
  @Input() strength = 0.3;
  @Input() speed = 0.3;
  @Input() enableGlow = true;

  private rect!: DOMRect;
  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
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
    this.rect = this.el.nativeElement.getBoundingClientRect();
    this.renderer.setStyle(this.el.nativeElement, 'will-change', 'transform');
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.isBrowser) return;
    this.rect = this.el.nativeElement.getBoundingClientRect();
    this.renderer.addClass(this.el.nativeElement, 'magnetic-active');
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (!this.isBrowser) return;
    this.targetX = 0;
    this.targetY = 0;
    this.renderer.removeClass(this.el.nativeElement, 'magnetic-active');
    this.animateToOrigin();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isBrowser) return;
    
    const centerX = this.rect.left + this.rect.width / 2;
    const centerY = this.rect.top + this.rect.height / 2;
    
    const distanceX = event.clientX - centerX;
    const distanceY = event.clientY - centerY;
    
    this.targetX = distanceX * this.strength;
    this.targetY = distanceY * this.strength;
    
    this.animate();
  }

  private animate(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    const lerp = (start: number, end: number, factor: number): number => {
      return start + (end - start) * factor;
    };

    const animateFrame = () => {
      this.currentX = lerp(this.currentX, this.targetX, this.speed);
      this.currentY = lerp(this.currentY, this.targetY, this.speed);

      this.renderer.setStyle(
        this.el.nativeElement,
        'transform',
        `translate(${this.currentX}px, ${this.currentY}px)`
      );

      if (Math.abs(this.targetX - this.currentX) > 0.01 || 
          Math.abs(this.targetY - this.currentY) > 0.01) {
        this.animationId = requestAnimationFrame(animateFrame);
      }
    };

    this.animationId = requestAnimationFrame(animateFrame);
  }

  private animateToOrigin(): void {
    const lerp = (start: number, end: number, factor: number): number => {
      return start + (end - start) * factor;
    };

    const animateFrame = () => {
      this.currentX = lerp(this.currentX, 0, 0.2);
      this.currentY = lerp(this.currentY, 0, 0.2);

      this.renderer.setStyle(
        this.el.nativeElement,
        'transform',
        `translate(${this.currentX}px, ${this.currentY}px)`
      );

      if (Math.abs(this.currentX) > 0.01 || Math.abs(this.currentY) > 0.01) {
        this.animationId = requestAnimationFrame(animateFrame);
      } else {
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translate(0, 0)');
      }
    };

    this.animationId = requestAnimationFrame(animateFrame);
  }
}
