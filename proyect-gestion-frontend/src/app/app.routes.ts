import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Login } from './features/login/login';

export const routes: Routes = [
    { path: 'login', component: Login },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
        canActivate: [authGuard],
    },
    /* {
        path: 'admin',
        loadComponent: () => import('./admin').then(m => m.AdminPage),
        canActivate: [roleGuard('admin')],
    }, */
    { path: '', redirectTo: 'login', pathMatch: 'full' },
];
