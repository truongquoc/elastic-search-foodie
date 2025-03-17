import { Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';

export const routes: Routes = [
  { 
    path: '', 
    component: SearchComponent,
    data: {
      title: 'Restaurant Search',
      renderMode: 'static'
    }
  },
  { 
    path: '**', 
    redirectTo: '', 
    pathMatch: 'full',
    data: {
      renderMode: 'static'
    }
  }
];

export const serverRoutes = routes.map(route => ({
  ...route,
  renderMode: route.data?.['renderMode'] || 'static'
}));
