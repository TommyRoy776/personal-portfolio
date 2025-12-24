import { Component, signal } from '@angular/core';
import { RouterOutlet,RouterLink } from '@angular/router';
import {AboutMe} from './features/about-me/about-me';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AboutMe, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('personal-portfolio');
}
