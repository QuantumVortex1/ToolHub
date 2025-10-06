import { Component } from '@angular/core';
import { TOOL_REGISTRY, ToolEntry } from '../../../core/tools/tools.registry';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, MatIcon],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  constructor(private router: Router) { }

  toolRegistry: ToolEntry[] = TOOL_REGISTRY;
  favourites: any[] = [];
  
  get availableTools(): ToolEntry[] {
    return this.toolRegistry.filter(tool => tool.id !== 'home');
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
