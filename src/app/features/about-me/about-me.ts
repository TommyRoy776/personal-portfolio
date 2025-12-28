import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-about-me',
  imports: [],
  templateUrl: './about-me.html',
  styleUrl: './about-me.css',
})
export class AboutMe {
  imageUrl: string;

  constructor(@Inject(DOCUMENT) private document: Document) {
    const base = this.document.getElementsByTagName('base')[0]?.href || '';
    this.imageUrl = `${base}1762903323652.jpeg`;
  }

}
