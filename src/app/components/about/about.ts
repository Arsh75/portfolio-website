import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ParticleService } from '../../services/particle.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  providers: [ParticleService],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor(private particleService: ParticleService) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.canvasRef) {
        this.particleService.init(this.canvasRef.nativeElement);
      }
    }, 100);
  }

  ngOnDestroy(): void {
    this.particleService.destroy();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.particleService.resize();
  }

  onMouseMove(event: MouseEvent): void {
    this.particleService.onMouseMove(event);
  }
}

