import { Routes } from '@angular/router';
import { SwipeComponent } from './swipe/swipe.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';

export const routes: Routes = [
  { path: '', redirectTo: 'swipe', pathMatch: 'full' },
  { path: 'swipe', component: SwipeComponent },
  { path: 'recommendations', component: RecommendationsComponent },
];