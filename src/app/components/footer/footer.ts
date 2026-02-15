import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MagneticButtonDirective } from '../../directives/magnetic-button.directive';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MagneticButtonDirective],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  scrollTo(section: string) {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

