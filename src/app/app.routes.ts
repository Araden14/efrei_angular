// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/todos',
    pathMatch: 'full',
  },
  {
    path: 'todos',
    canActivate: [authGuard], // Protection par authentification
    loadChildren: () => import('./features/todos/todos.routes').then((m) => m.todoRoutes),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard], // Protection admin
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },
];
