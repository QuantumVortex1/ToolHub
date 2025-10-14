import { Component, inject, ViewChild, ElementRef, HostListener, Output, EventEmitter, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SearchService, SearchResult } from '../../../core/search/search.service';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../../core/favorites/favorites.service';

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
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  constructor(
    private searchService: SearchService,
    private favoritesService: FavoritesService
  ) { }
  private router = inject(Router);

  @Output() toggleSidenav = new EventEmitter<void>();
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('mobileSearchInput') mobileSearchInput!: ElementRef<HTMLInputElement>;

  searchControl = new FormControl<SearchResult | null>(null);
  mobileSearchOpen = false;
  currentRoute: string = '';
  isCurrentToolFavorite = false;

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

    this.router.events.subscribe(() => {
      this.updateCurrentRoute();
    });
    this.updateCurrentRoute();
  }

  private updateCurrentRoute(): void {
    this.currentRoute = this.router.url;
    this.isCurrentToolFavorite = this.favoritesService.isFavorite(this.currentRoute);
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

  toggleCurrentToolFavorite(): void {
    if (this.currentRoute && this.currentRoute !== '/') {
      const wasAdded = this.favoritesService.toggleFavorite(this.currentRoute);
      this.isCurrentToolFavorite = wasAdded;
    }
  }

  showTooltip(): boolean {
    return !!this.currentRoute && this.currentRoute !== '/';
  }
}
