import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'document/:id',
    loadComponent: () => import('./pages/document/document').then((m) => m.Document),
  },
];
