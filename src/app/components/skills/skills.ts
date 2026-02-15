import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class SkillsComponent {
  skillCategories = [
    {
      name: 'Backend',
      skills: ['.NET Core', '.NET Framework', 'VB.NET', 'C#', 'REST APIs', 'Web APIs'],
      icon: 'fa-server'
    },
    {
      name: 'Frontend',
      skills: ['Angular', 'TypeScript', 'HTML5', 'CSS3/SCSS', 'JavaScript', 'Material UI'],
      icon: 'fa-laptop-code'
    },
    {
      name: 'Database',
      skills: ['SQL Server', 'T-SQL', 'Query Optimization', 'Indexing', 'Stored Procedures'],
      icon: 'fa-database'
    },
    {
      name: 'DevOps & Tools',
      skills: ['Azure DevOps', 'Git', 'CI/CD Pipelines', 'Visual Studio', 'VS Code', 'Postman'],
      icon: 'fa-screwdriver-wrench'
    }
  ];
}
