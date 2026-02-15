import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'user-theme';
  isDarkMode = signal<boolean>(this.getInitialTheme());

  constructor() {
    this.applyTheme(this.isDarkMode());
  }

  toggleTheme() {
    const newMode = !this.isDarkMode();
    this.isDarkMode.set(newMode);
    this.applyTheme(newMode);
    localStorage.setItem(this.THEME_KEY, newMode ? 'dark' : 'light');
  }

  private getInitialTheme(): boolean {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(isDark: boolean) {
    if (isDark) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }
}
