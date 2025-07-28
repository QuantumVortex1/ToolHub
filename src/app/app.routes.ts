import { Routes } from '@angular/router';
import { LandingComponent } from './components/main/landing/landing.component';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'tools/converter', component: LandingComponent },
    
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
