import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { CursorTextDirective } from '../../directives/custom-cursor.directive';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule, CursorTextDirective],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class ProjectsComponent {
  projects = [
    {
      title: 'Custom Dashboard Platform',
      description: 'An enterprise analytics platform with drag-and-drop widgets (Gridster-based) for survey data visualization. Built segmentation, cross-tab, trend charts, and export features.',
      tech: ['Angular', '.NET Core', 'SQL Server', 'REST APIs'],
      link: 'https://www.sogolytics.com/blog/feature-focus-custom-dashboards/',
      icon: 'fa-chart-line'
    },
    {
      title: 'AI-Powered Dashboard Chatbot',
      description: 'Intelligent chatbot with tool-calling capabilities enabling natural language commands to interact with survey data and generate visualizations automatically.',
      tech: ['AI Framework', '.NET Core', 'Angular', 'NLP'],
      link: '#',
      icon: 'fa-robot'
    },
    {
      title: 'Student Attendance System',
      description: 'Academic project: Face recognition-based attendance system using LBPH algorithm with a Tkinter GUI for tracking student attendance in departments.',
      tech: ['Python', 'OpenCV', 'SQL', 'Tkinter'],
      link: 'https://github.com/Arsh75',
      icon: 'fa-user-check'
    }
  ];
}
