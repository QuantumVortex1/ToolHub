import { Component, OnInit, OnDestroy } from '@angular/core';
import { TOOL_REGISTRY, ToolEntry, getFavorites } from '../../../core/tools/tools.registry';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { FavoritesService } from '../../../core/favorites/favorites.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, MatIcon, MatButtonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private favoritesService: FavoritesService
  ) { }

  toolRegistry: ToolEntry[] = TOOL_REGISTRY;
  favourites: ToolEntry[] = [];
  private favoritesSubscription?: Subscription;
  
  get availableTools(): ToolEntry[] {
    return this.toolRegistry.filter(tool => tool.id !== 'home');
  }

  ngOnInit(): void {
    this.favoritesSubscription = this.favoritesService.favorites$.subscribe(favoriteRoutes => {
      this.favourites = getFavorites(favoriteRoutes);
    });
  }

  ngOnDestroy(): void {
    if (this.favoritesSubscription) this.favoritesSubscription.unsubscribe();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  removeFavorite(tool: ToolEntry, event: Event): void {
    event.stopPropagation();
    this.favoritesService.toggleFavorite(tool.route);
  }
}
