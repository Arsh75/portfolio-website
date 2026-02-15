import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { ParticleService } from '../../services/particle.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  providers: [ParticleService],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class ExperienceComponent implements AfterViewInit, OnDestroy {
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

  experiences = [
    {
      company: 'Sogolytics',
      role: 'Software Engineer Analyst - 1',
      period: 'Oct 2024 - Present',
      points: [
        'Develop data visualization widgets (Cross Tab, Trend, Rating, Open-End) using Angular and .NET Core APIs.',
        'Built AI-powered chatbot with tool-calling capabilities to automate dashboard interactions.',
        'Achieved 3x performance improvement on Cross Tab processing through API and query optimization.',
        'Implement scalable data segmentation and export functionality for global enterprise clients.',
        'Manage CI/CD pipelines and legacy code maintenance in Azure DevOps.'
      ]
    },
    {
      company: 'Sogolytics',
      role: 'Trainee Technical Analyst',
      period: 'Jul 2023 - Oct 2024',
      points: [
        'Developed backend reporting services using .NET Framework and .NET Core.',
        'Created reusable Angular components for survey data visualization.',
        'Optimized complex SQL queries for reporting modules, improving data load times.',
        'Promoted to Analyst within 15 months based on performance and impact.'
      ]
    },
    {
      company: 'Autometa Corporation',
      role: 'Project Intern',
      period: 'Sep 2022 - Oct 2023',
      points: [
        'Engineered an NLP-based document summarization system for multiple file formats.',
        'Developed a responsive frontend using HTML5, CSS, and JavaScript.',
        'Integrated NLP pipelines for efficient text extraction and AI-driven insights.'
      ]
    }
  ];
}

