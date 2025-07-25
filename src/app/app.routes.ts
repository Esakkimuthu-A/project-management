import { Routes } from '@angular/router';

export const routes: Routes = [
  { path:'', redirectTo: "/app/dashboard", pathMatch: 'full' },
  {
    path: 'app', loadComponent: () => import('./core/components/home/home').then((m) => m.Home), children: [
      { path: 'dashboard', loadComponent: () => import('./core/components/dashboard/dashboard').then((e) => e.Dashboard) },
      { path: 'resources', loadComponent: () => import('./core/components/resources/resources').then((e) => e.Resources) },
      { path: 'tasks', loadComponent: () => import('./core/components/tasks/tasks').then((e) => e.Tasks) },
    ],
  },
  { path: '**', redirectTo: '' }
];
