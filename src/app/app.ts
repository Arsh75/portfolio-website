import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { HeroComponent } from './components/hero/hero';
import { AboutComponent } from './components/about/about';
import { ExperienceComponent } from './components/experience/experience';
import { ProjectsComponent } from './components/projects/projects';
import { SkillsComponent } from './components/skills/skills';
import { ContactComponent } from './components/contact/contact';
import { FooterComponent } from './components/footer/footer';
import AOS from 'aos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    ExperienceComponent,
    ProjectsComponent,
    SkillsComponent,
    ContactComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  ngOnInit() {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false
    });
  }
}
