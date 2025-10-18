import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TOOL_REGISTRY, ToolEntry } from '../../core/tools/tools.registry';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  @Input() isExpanded: boolean = false;
  @Output() toggleSidenav = new EventEmitter<void>();

  tools: ToolEntry[] = TOOL_REGISTRY;
  activeRoute: string = '';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      if (url.startsWith('/tools/converter/')) this.activeRoute = '/tools/converter';
      else this.activeRoute = url;
    });
  }

  onToggle() {
    this.toggleSidenav.emit();
  }

  navigateTo(route: string) {
    if (this.isExpanded) this.toggleSidenav.emit();
    this.router.navigate([route]);
  }

  closeSidenav() {
    if (this.isExpanded) this.toggleSidenav.emit();
  }
}
