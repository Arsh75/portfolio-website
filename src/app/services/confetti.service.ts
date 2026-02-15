import { Injectable, OnDestroy } from '@angular/core';

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  alpha: number;
  shape: 'dot' | 'dash' | 'square' | 'triangle';
}

@Injectable()
export class ConfettiService implements OnDestroy {
  private particles: ConfettiParticle[] = [];
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationId: number | null = null;
  private mouseX = -9999;
  private mouseY = -9999;
  private isActive = false;
  private isMobile = false;
  private resizeObserver: ResizeObserver | null = null;

  private readonly config = {
    particleCount: 65,
    maxSpeed: 0.4,
    minSpeed: 0.08,
    minSize: 2.5,
    maxSize: 6,
    mouseRepelDistance: 120,
    mouseRepelForce: 0.015,
    colors: [
      '#6366f1', // indigo
      '#ec4899', // pink
      '#06b6d4', // cyan
      '#8b5cf6', // purple
      '#f59e0b', // amber
      '#10b981', // emerald
      '#ef4444', // red
      '#3b82f6', // blue
      '#f97316', // orange
      '#14b8a6', // teal
    ],
  };

  ngOnDestroy(): void {
    this.destroy();
  }

  init(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isMobile = this.checkMobile();

    if (this.isMobile) return;

    this.resize();
    this.setupResizeObserver();
    this.createParticles();
    this.animate();
    this.isActive = true;
  }

  resize(): void {
    if (!this.canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
  }

  onMouseLeave(): void {
    this.mouseX = -9999;
    this.mouseY = -9999;
  }

  destroy(): void {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    this.particles = [];
    this.ctx = null;
    this.canvas = null;
  }

  private checkMobile(): boolean {
    return window.innerWidth < 768 || 'ontouchstart' in window;
  }

  private setupResizeObserver(): void {
    if (!this.canvas) return;
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvas);
  }

  private createParticles(): void {
    if (!this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    this.particles = [];
    const shapes: ConfettiParticle['shape'][] = ['dot', 'dash', 'square', 'triangle'];

    for (let i = 0; i < this.config.particleCount; i++) {
      const speed =
        this.config.minSpeed +
        Math.random() * (this.config.maxSpeed - this.config.minSpeed);
      const angle = Math.random() * Math.PI * 2;

      this.particles.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size:
          this.config.minSize +
          Math.random() * (this.config.maxSize - this.config.minSize),
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        color:
          this.config.colors[
            Math.floor(Math.random() * this.config.colors.length)
          ],
        alpha: 0.35 + Math.random() * 0.45,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }
  }

  private animate = (): void => {
    if (!this.isActive || !this.ctx || !this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, rect.width, rect.height);

    this.updateParticles(rect.width, rect.height);
    this.drawParticles();

    this.animationId = requestAnimationFrame(this.animate);
  };

  private updateParticles(width: number, height: number): void {
    const repelDist = this.config.mouseRepelDistance;
    const repelForce = this.config.mouseRepelForce;

    for (const p of this.particles) {
      // Mouse repulsion
      const dx = p.x - this.mouseX;
      const dy = p.y - this.mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < repelDist && dist > 0) {
        const force = ((repelDist - dist) / repelDist) * repelForce;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      // Apply velocity
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;

      // Speed clamping — drift back to gentle speeds
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > this.config.maxSpeed) {
        p.vx *= 0.98;
        p.vy *= 0.98;
      }

      // Wrap around edges
      if (p.x < -p.size) p.x = width + p.size;
      if (p.x > width + p.size) p.x = -p.size;
      if (p.y < -p.size) p.y = height + p.size;
      if (p.y > height + p.size) p.y = -p.size;
    }
  }

  private drawParticles(): void {
    if (!this.ctx) return;

    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;

      switch (p.shape) {
        case 'dot':
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          this.ctx.fill();
          break;

        case 'dash':
          this.ctx.fillRect(-p.size * 1.5, -p.size * 0.3, p.size * 3, p.size * 0.6);
          break;

        case 'square':
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          break;

        case 'triangle':
          this.ctx.beginPath();
          this.ctx.moveTo(0, -p.size / 2);
          this.ctx.lineTo(-p.size / 2, p.size / 2);
          this.ctx.lineTo(p.size / 2, p.size / 2);
          this.ctx.closePath();
          this.ctx.fill();
          break;
      }

      this.ctx.restore();
    }
  }
}
