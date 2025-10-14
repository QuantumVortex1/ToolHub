import { Component, inject, ViewChild, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SearchService, SearchResult } from '../../../core/search/search.service';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private searchService: SearchService) { }
  private router = inject(Router);

  @Output() toggleSidenav = new EventEmitter<void>();
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('mobileSearchInput') mobileSearchInput!: ElementRef<HTMLInputElement>;

  searchControl = new FormControl<SearchResult | null>(null);
  mobileSearchOpen = false;

  suggestions: SearchResult[] = [];

  onMenuClick() {
    this.toggleSidenav.emit();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'k') {
      event.preventDefault();
      this.focusSearchInput();
    }
  }

  focusSearchInput() {
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  ngOnInit(): void {
    this.searchControl.valueChanges.subscribe(value => {
      if (typeof value === 'string') {
        this.search(value);
      }
    });
  }

  search(query: string): void {
    this.suggestions = this.searchService.search(query);
  }

  displayFn(suggestion: SearchResult): string {
    return suggestion ? suggestion.display : '';
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  toggleMobileSearch(): void {
    this.mobileSearchOpen = !this.mobileSearchOpen;
    if (this.mobileSearchOpen) {
      setTimeout(() => {
        if (this.mobileSearchInput) {
          this.mobileSearchInput.nativeElement.focus();
        }
      }, 100);
    }
  }

  closeMobileSearch(): void {
    this.mobileSearchOpen = false;
  }
}
