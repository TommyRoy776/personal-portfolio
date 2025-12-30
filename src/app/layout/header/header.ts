import { Component, Input, Output,EventEmitter } from '@angular/core';
import { PageType } from '../../types/page.type';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  pages: PageType[] = ["Professional Experience","About Me"]
  @Input() currentPage: PageType | '' = '';
  @Output() currentPageChange = new EventEmitter<PageType>();

  setCurrentPage(page: PageType) {
    this.currentPageChange.emit(page);
  }
}
