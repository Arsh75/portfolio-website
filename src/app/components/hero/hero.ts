import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MagneticButtonDirective } from '../../directives/magnetic-button.directive';
import { CardTiltDirective } from '../../directives/card-tilt.directive';
import { ConfettiService } from '../../services/confetti.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MagneticButtonDirective, CardTiltDirective],
  providers: [ConfettiService],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('confettiCanvas') confettiCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private confettiService: ConfettiService) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.confettiCanvas) {
        this.confettiService.init(this.confettiCanvas.nativeElement);
      }
    }, 100);
  }

  ngOnDestroy(): void {
    this.confettiService.destroy();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.confettiService.resize();
  }

  onMouseMove(event: MouseEvent): void {
    this.confettiService.onMouseMove(event);
  }

  onMouseLeave(): void {
    this.confettiService.onMouseLeave();
  }

  scrollTo(section: string): void {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
