import { Component, signal, OnInit, AfterViewInit, OnDestroy, effect } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { AboutMe } from './features/about-me/about-me';
import { JobExperience } from './features/job-experience/job-experience';
import { Header } from './layout/header/header';
import { PageType } from './types/page.type';

interface Building {
  x: number;
  width: number;
  height: number;
  windows: { x: number; y: number; w: number; h: number; color: string }[];
}

@Component({
  selector: 'app-root',
  imports: [AboutMe, JobExperience, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private scrollOffset = 0;
  private buildings: Building[] = [];
  private scrollHandler = () => {
    this.scrollOffset = window.scrollY;
    this.drawScene();
  };
  private resizeHandler = () => {
    this.resizeCanvas();
    this.generateBuildings();
    this.drawScene();
  };

  constructor(
    private location: Location,
    private titleService: Title
  ) {
    effect(() => {
      const page = this.currentPage();
      if (page === 'Professional Experience') {
        this.location.replaceState('/experience');
        this.titleService.setTitle('Professional Experience - MING WAI TOMMY CHAN');
      } else if (page === 'About Me') {
        this.location.replaceState('/about-me');
        this.titleService.setTitle('About Me - MING WAI TOMMY CHAN');
      }
    });
  }

  ngOnInit(): void {}

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

    this.initCyberpunkBg();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollHandler);
    window.removeEventListener('resize', this.resizeHandler);
  }

  handleHeaderNavigation(page: PageType) {
    this.currentPage.set(page);
    const element = document.getElementById(page);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }

  paths: string[] = [];
  pageIndex = signal(0);
  currentPage = signal<PageType>('Professional Experience');

  // ─── Cyberpunk Background ────────────────────────────────────────────────

  private initCyberpunkBg(): void {
    this.canvas = document.getElementById('cyberpunk-canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.resizeCanvas();
    this.generateBuildings();
    this.drawScene();
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    window.addEventListener('resize', this.resizeHandler);
  }

  private resizeCanvas(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private generateBuildings(): void {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const horizonY = h * 0.52;
    this.buildings = [];
    const count = Math.ceil(w / 60) + 2;
    let x = -40;
    for (let i = 0; i < count; i++) {
      const bw = 40 + Math.random() * 80;
      const bh = 60 + Math.random() * (horizonY * 0.85);
      const windows: Building['windows'] = [];
      const cols = Math.floor(bw / 14);
      const rows = Math.floor(bh / 16);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() > 0.45) {
            const colors = ['#00ffff', '#ff00ff', '#00ffff', '#ffffff', '#7700ff'];
            windows.push({
              x: c * 14 + 4,
              y: r * 16 + 4,
              w: 6,
              h: 8,
              color: colors[Math.floor(Math.random() * colors.length)]
            });
          }
        }
      }
      this.buildings.push({ x, width: bw, height: bh, windows });
      x += bw + 4 + Math.random() * 10;
    }
  }

  private drawScene(): void {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const scroll = this.scrollOffset;
    const horizonY = H * 0.52;
    const vpX = W / 2; // vanishing point x

    // ── Sky gradient ──
    const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
    sky.addColorStop(0, '#020008');
    sky.addColorStop(0.6, '#07011a');
    sky.addColorStop(1, '#12003a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, horizonY);

    // ── Stars ──
    ctx.save();
    // Deterministic "random" stars using sin
    for (let i = 0; i < 120; i++) {
      const sx = ((Math.sin(i * 7.13) * 0.5 + 0.5) * W);
      const sy = ((Math.sin(i * 3.77) * 0.5 + 0.5) * horizonY * 0.9);
      const brightness = 0.3 + Math.sin(i * 2.1) * 0.2;
      ctx.fillStyle = `rgba(180, 180, 255, ${brightness})`;
      ctx.fillRect(sx, sy, 1, 1);
    }
    ctx.restore();

    // ── Buildings ──
    this.buildings.forEach((b) => {
      const by = horizonY - b.height;
      // Body
      ctx.fillStyle = '#050010';
      ctx.fillRect(b.x, by, b.width, b.height);
      // Windows
      b.windows.forEach((win) => {
        ctx.fillStyle = win.color;
        ctx.shadowColor = win.color;
        ctx.shadowBlur = 4;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(b.x + win.x, by + win.y, win.w, win.h);
      });
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      // Rooftop neon line
      ctx.strokeStyle = Math.random() > 0.5 ? '#ff00ff' : '#00ffff';
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 8;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(b.x, by);
      ctx.lineTo(b.x + b.width, by);
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // ── Ground / floor gradient ──
    const ground = ctx.createLinearGradient(0, horizonY, 0, H);
    ground.addColorStop(0, '#050010');
    ground.addColorStop(1, '#020008');
    ctx.fillStyle = ground;
    ctx.fillRect(0, horizonY, W, H - horizonY);

    // ── Perspective grid ──
    // Grid moves with scroll: offset wraps every GRID_REPEAT pixels
    const GRID_REPEAT = 80; // virtual grid unit in "floor space"
    const scrollMod = scroll % GRID_REPEAT;
    const gridOffset = (scrollMod / GRID_REPEAT); // 0..1

    // Number of horizontal lines to draw
    const LINE_COUNT = 20;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, horizonY, W, H - horizonY);
    ctx.clip();

    // Perspective mapping: t=0 → horizon, t=1 → bottom
    // We shift t by gridOffset to animate on scroll
    for (let i = 0; i <= LINE_COUNT; i++) {
      // t ranges from near-0 (horizon) to 1 (bottom)
      // Use exponential spacing for perspective
      const t = Math.pow((i + gridOffset) / LINE_COUNT, 1.8);
      if (t > 1) continue;
      const y = horizonY + t * (H - horizonY);
      const alpha = 0.15 + t * 0.6;
      ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = t * 6;
      ctx.lineWidth = 0.5 + t * 1.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Vertical converging lines (from bottom edge to vanishing point)
    const V_LINES = 16;
    for (let i = 0; i <= V_LINES; i++) {
      const bx = (i / V_LINES) * W;
      const alpha = i === 0 || i === V_LINES ? 0.4 : 0.2;
      ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 4;
      ctx.lineWidth = i === 0 || i === V_LINES ? 1 : 0.5;
      ctx.beginPath();
      ctx.moveTo(vpX, horizonY);
      ctx.lineTo(bx, H);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
    ctx.restore();

    // ── Horizon glow line ──
    const horizonGlow = ctx.createLinearGradient(0, horizonY - 4, 0, horizonY + 4);
    horizonGlow.addColorStop(0, 'rgba(255, 0, 255, 0)');
    horizonGlow.addColorStop(0.5, 'rgba(255, 0, 255, 0.9)');
    horizonGlow.addColorStop(1, 'rgba(0, 255, 255, 0)');
    ctx.fillStyle = horizonGlow;
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 18;
    ctx.fillRect(0, horizonY - 4, W, 8);
    ctx.shadowBlur = 0;

    // ── Scanlines overlay ──
    ctx.save();
    for (let y = 0; y < H; y += 4) {
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, y, W, 2);
    }
    ctx.restore();
  }
}
