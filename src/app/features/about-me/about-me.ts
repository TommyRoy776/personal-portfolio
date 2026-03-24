import { Component, Inject, signal, OnInit, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-about-me',
  imports: [],
  templateUrl: './about-me.html',
  styleUrl: './about-me.css',
})
export class AboutMe implements OnInit, OnDestroy {
  base: string;
  imageOpacity = signal(1);
  private scrollListener!: () => void;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.base = this.document.getElementsByTagName('base')[0]?.href || '';
  }

  ngOnInit(): void {
    this.scrollListener = () => this.onScroll();
    window.addEventListener('scroll', this.scrollListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollListener);
  }

  private onScroll(): void {
    const element = this.document.querySelector('app-about-me');
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Fade in as section enters viewport, fade out as section bottom leaves
    const fadeIn  = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight * 0.6)));
    const fadeOut = Math.max(0, Math.min(1, (rect.bottom - windowHeight * 0.3) / (windowHeight * 0.5)));
    this.imageOpacity.set(Math.min(fadeIn, fadeOut));
  }

}
