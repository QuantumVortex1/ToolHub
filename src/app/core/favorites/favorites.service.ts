import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface FavoriteTool {
  route: string;
  name: string;
  description: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'toolhub-favorites';
  private favoritesSubject = new BehaviorSubject<string[]>([]);
  
  public favorites$ = this.favoritesSubject.asObservable();

  constructor() {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const favorites = stored ? JSON.parse(stored) : [];
      this.favoritesSubject.next(favorites);
    } catch (error) {
      console.warn('Fehler beim Laden der Favoriten:', error);
      this.favoritesSubject.next([]);
    }
  }

  private saveFavorites(favorites: string[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
      this.favoritesSubject.next(favorites);
    } catch (error) {
      console.error('Fehler beim Speichern der Favoriten:', error);
    }
  }

  isFavorite(route: string): boolean {
    return this.favoritesSubject.value.includes(route);
  }

  toggleFavorite(route: string): boolean {
    const currentFavorites = this.favoritesSubject.value;
    const index = currentFavorites.indexOf(route);
    
    let newFavorites: string[];
    if (index > -1) newFavorites = currentFavorites.filter(fav => fav !== route);
    else newFavorites = [...currentFavorites, route];
    
    this.saveFavorites(newFavorites);
    return index === -1;
  }

  getFavorites(): string[] {
    return this.favoritesSubject.value;
  }

  clearAllFavorites(): void {
    this.saveFavorites([]);
  }
}