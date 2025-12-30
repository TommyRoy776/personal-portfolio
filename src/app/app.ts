import { Component, signal, OnInit, AfterViewInit, effect } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { AboutMe } from './features/about-me/about-me';
import { JobExperience } from './features/job-experience/job-experience';
import { Header } from './layout/header/header';
import { PageType } from './types/page.type';

@Component({
  selector: 'app-root',
  imports: [AboutMe, JobExperience, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, AfterViewInit {
  constructor(
    private location: Location,
    private titleService: Title
  ) {
    effect(() => {
      const page = this.currentPage();
      console.log(page);
      
      // Update URL based on current page
      if (page === 'Professional Experience') {
        this.location.replaceState('/experience');
        this.titleService.setTitle('Professional Experience - MING WAI TOMMY CHAN');
      } else if (page === 'About Me') {
        this.location.replaceState('/about-me');
        this.titleService.setTitle('About Me - MING WAI TOMMY CHAN');
      }
    });
  }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    const sections = document.querySelectorAll('app-job-experience, app-about-me');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tagName = entry.target.tagName.toLowerCase();
            if (tagName === 'app-job-experience') {
              this.currentPage.set('Professional Experience');
            } else if (tagName === 'app-about-me') {
              this.currentPage.set('About Me');
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  handleHeaderNavigation(page: PageType) {
    this.currentPage.set(page);
    const element = document.getElementById(page);
    if (element) {
      const headerOffset = 100; // Adjust this value for your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }  
  
  paths: string[] = [];
  pageIndex = signal(0);
  protected readonly title = signal('personal-portfolio');
  currentPage = signal<PageType>('Professional Experience');
}
