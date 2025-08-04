import { Routes } from '@angular/router';
import { LandingComponent } from './components/main/landing/landing.component';
import { PizzaComponent } from './components/tools/pizza/pizza.component';
import { ConverterComponent } from './components/tools/converter/converter.component';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'tools/converter', component: ConverterComponent },
    { path: 'tools/pizza', component: PizzaComponent },    
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
