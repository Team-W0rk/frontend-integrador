import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Login } from './features/login/login';

export const routes: Routes = [
    { path: 'login', component: Login },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
        import('./shared/layout/layout/layout').then(m => m.Layout),
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                import('./features/dashboard/dashboard').then(m => m.Dashboard),
            },
            {
                path: 'proyectos',
                loadComponent: () =>
                import('./features/proyecto/proyectos/proyectos').then(m => m.Proyectos),
            },
            {
                path: 'proyectos/nuevo',
                loadComponent: () =>
                import('./features/proyecto/proyecto-form/proyecto-form').then(m => m.ProyectoForm),
            },
            {
                path: 'proyectos/editar/:id',
                loadComponent: () =>
                import('./features/proyecto/proyecto-form/proyecto-form').then(m => m.ProyectoForm)
            },
            {
                path: 'proyectos/:id',
                loadComponent: () =>
                import('./features/proyecto/proyecto-detail/proyecto-detail').then(m => m.ProyectoDetail)
            },
            {
                path: 'clientes',
                loadComponent: () =>
                import('./features/cliente/clientes/clientes').then(m => m.Clientes),
            },
            {
                path: 'clientes/nuevo',
                loadComponent: () =>
                import('./features/cliente/cliente-form/cliente-form').then(m => m.ClienteForm)
            },
            {
                path: 'clientes/editar/:id',
                loadComponent: () =>
                import('./features/cliente/cliente-form/cliente-form').then(m => m.ClienteForm)
            },
            {
                path: 'clientes/:id',
                loadComponent: () =>
                import('./features/cliente/cliente-detail/cliente-detail').then(m => m.ClienteDetail)
            },
            {
                path: 'historial',
                loadComponent: () =>
                import('./features/historial/historial').then(m => m.HistorialComponent)
            },
            {
                path: 'usuarios',
                loadComponent: () =>
                import('./features/usuarios/usuario/usuario').then(m => m.UsuarioDashboard),
            },
            {
                path: 'usuarios/nuevo',
                loadComponent: () =>
                import('./features/usuarios/usuario-form/usuario-form').then(m => m.UsuarioForm)
            },
            {
                path: 'usuarios/editar/:id',
                loadComponent: () =>
                import('./features/usuarios/usuario-form/usuario-form').then(m => m.UsuarioForm)
            },
            {
                path: 'usuarios/:id',
                loadComponent: () =>
                import('./features/usuarios/usuario-detail/usuario-detail').then(m => m.UsuarioDetail)
            }
        ]   
    },

    /* {
        path: 'admin',
        loadComponent: () => import('./admin').then(m => m.AdminPage),
        canActivate: [roleGuard('admin')],
    }, */
    { path: '', redirectTo: 'login', pathMatch: 'full' },
];
