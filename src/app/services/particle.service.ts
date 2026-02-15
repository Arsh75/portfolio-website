import { Injectable, OnDestroy } from '@angular/core';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  targetAlpha: number;
}

@Injectable()
export class ParticleService implements OnDestroy {
  private particles: Particle[] = [];
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationId: number | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private isActive = false;
  private isMobile = false;
  private lastMouseMove = 0;
  private throttleDelay = 50;

  private config = {
    particleCount: 40,
    connectionDistance: 150,
    mouseDistance: 200,
    maxSpeed: 0.8,
    minSpeed: 0.2,
    baseSize: 2,
    maxSize: 4,
    baseAlpha: 0.3,
    maxAlpha: 0.8,
    colors: ['#6366f1', '#ec4899', '#06b6d4', '#8b5cf6', '#f472b6']
  };

  private colors = {
    primary: '#6366f1',
    accent: '#ec4899',
    secondary: '#06b6d4',
    background: '#0b0f2a'
  };

  ngOnDestroy(): void {
    this.destroy();
  }

  init(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isMobile = this.checkMobile();

    if (this.isMobile) {
      this.pause();
      return;
    }

    this.resize();
    this.createParticles();
    this.animate();
    this.isActive = true;
  }

  resize(): void {
    if (!this.canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
    }
  }

  onMouseMove(event: MouseEvent): void {
    const now = Date.now();
    if (now - this.lastMouseMove < this.throttleDelay) return;
    this.lastMouseMove = now;

    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
  }

  pause(): void {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  resume(): void {
    if (this.isMobile || this.isActive) return;
    this.isActive = true;
    this.animate();
  }

  destroy(): void {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.particles = [];
    this.ctx = null;
    this.canvas = null;
  }

  private checkMobile(): boolean {
    return window.innerWidth < 768 || 'ontouchstart' in window;
  }

  private createParticles(): void {
    if (!this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    this.particles = [];

    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 2 * this.config.maxSpeed,
        vy: (Math.random() - 0.5) * 2 * this.config.maxSpeed,
        size: this.config.baseSize + Math.random() * (this.config.maxSize - this.config.baseSize),
        alpha: this.config.baseAlpha,
        targetAlpha: this.config.baseAlpha
      });
    }
  }

  private animate = (): void => {
    if (!this.isActive || !this.ctx || !this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, rect.width, rect.height);

    this.updateParticles(rect.width, rect.height);
    this.drawParticles();
    this.drawConnections(rect.width, rect.height);

    this.animationId = requestAnimationFrame(this.animate);
  };

  private updateParticles(width: number, height: number): void {
    const mouseInfluence = this.config.mouseDistance;

    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouseInfluence) {
        const force = (mouseInfluence - distance) / mouseInfluence;
        particle.vx += (dx / distance) * force * 0.1;
        particle.vy += (dy / distance) * force * 0.1;
        particle.targetAlpha = this.config.maxAlpha;
      } else {
        particle.targetAlpha = this.config.baseAlpha;
      }

      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      if (speed > this.config.maxSpeed) {
        particle.vx = (particle.vx / speed) * this.config.maxSpeed;
        particle.vy = (particle.vy / speed) * this.config.maxSpeed;
      }

      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;

      particle.alpha += (particle.targetAlpha - particle.alpha) * 0.1;
    });
  }

  private drawParticles(): void {
    if (!this.ctx) return;

    this.particles.forEach(particle => {
      const gradient = this.ctx!.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 2
      );

      gradient.addColorStop(0, this.hexToRgba(this.colors.primary, particle.alpha));
      gradient.addColorStop(0.5, this.hexToRgba(this.colors.accent, particle.alpha * 0.5));
      gradient.addColorStop(1, 'transparent');

      this.ctx!.beginPath();
      this.ctx!.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
      this.ctx!.fillStyle = gradient;
      this.ctx!.fill();
    });
  }

  private drawConnections(width: number, height: number): void {
    if (!this.ctx) return;

    const connectionDistance = this.config.connectionDistance;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const mouseDx = this.mouseX - (p1.x + p2.x) / 2;
          const mouseDy = this.mouseY - (p1.y + p2.y) / 2;
          const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

          let opacity = (connectionDistance - distance) / connectionDistance;

          if (mouseDistance < this.config.mouseDistance) {
            const mouseInfluence = 1 - (mouseDistance / this.config.mouseDistance);
            opacity *= (0.3 + mouseInfluence * 0.7);
          }

          const gradient = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          gradient.addColorStop(0, this.hexToRgba(this.colors.primary, opacity * 0.4));
          gradient.addColorStop(1, this.hexToRgba(this.colors.secondary, opacity * 0.2));

          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = gradient;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
