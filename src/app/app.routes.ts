import { Routes } from '@angular/router';
import { LandingComponent } from './components/main/landing/landing.component';
import { PizzaComponent } from './components/tools/pizza/pizza.component';
import { ConverterComponent } from './components/tools/converter/converter.component';
import { AlcoholLevelComponent } from './components/tools/alcohol-level/alcohol-level.component';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    // { path: 'tools/converter', component: ConverterComponent },
    { path: 'tools/pizza', component: PizzaComponent },
    { path: 'tools/alcohol-level', component: AlcoholLevelComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
