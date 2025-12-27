import { Component, signal, OnInit, HostListener, effect } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AboutMe } from './features/about-me/about-me';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AboutMe, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  constructor(private router: Router) {
    effect(() => {
      const index = this.pageIndex();
      this.setPage();
    });
  }

  ngOnInit(): void {
    this.paths = this.router.config
      .map(r => '/' + r.path)
      .filter(p => p !== '/undefined');
    this.pageIndex.set(0);
  }
  paths: string[] = [];
  pageIndex = signal(0);
  protected readonly title = signal('personal-portfolio');
  setPage() {
    this.router.navigate([this.paths[this.pageIndex()]]);
  }

  setPageIndex(deltaY: number) {
    if (deltaY > 0 && this.pageIndex() > 0) {
      this.pageIndex.update(i => i - 1);
    } else if (deltaY < 0 && this.pageIndex() < this.paths.length - 1) {
      this.pageIndex.update(i => i + 1);
    }

  }
  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent) {
    console.log('deltaY:', event.deltaY);
    this.setPageIndex(event.deltaY)
  }
}
