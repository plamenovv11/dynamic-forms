import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'admin/forms', pathMatch: 'full' },
  {
    path: 'admin',
    children: [
      { path: 'forms', loadComponent: () => import('./pages/admin/form-list/form-list.component').then(m => m.FormListComponent) },
      { path: 'forms/:id', loadComponent: () => import('./pages/admin/form-builder/form-builder.component').then(m => m.FormBuilderComponent) },
      { path: 'flows', loadComponent: () => import('./pages/admin/flow-list/flow-list.component').then(m => m.FlowListComponent) },
      { path: 'flows/:id', loadComponent: () => import('./pages/admin/flow-builder/flow-builder.component').then(m => m.FlowBuilderComponent) },
      { path: 'rules', loadComponent: () => import('./pages/admin/rule-builder/rule-builder.component').then(m => m.RuleBuilderComponent) },
    ],
  },
  {
    path: 'flows',
    children: [
      { path: '', loadComponent: () => import('./pages/user/flow-list/user-flow-list.component').then(m => m.UserFlowListComponent) },
      { path: ':id/run', loadComponent: () => import('./pages/user/flow-runner/flow-runner.component').then(m => m.FlowRunnerComponent) },
    ],
  },
  {
    path: 'submissions',
    loadComponent: () => import('./pages/user/submissions/submissions.component').then(m => m.SubmissionsComponent),
  },
];
