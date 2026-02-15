import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../services/theme';
import { MagneticButtonDirective } from '../../directives/magnetic-button.directive';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MagneticButtonDirective],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  isMenuOpen = false;

  constructor(public themeService: ThemeService) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrollTo(section: string) {
    this.isMenuOpen = false;
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
