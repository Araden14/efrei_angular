import { Routes } from '@angular/router';
import { TodoListComponent } from './components/todo-list.component';

export const todoRoutes: Routes = [
  {
    path: '',
    component: TodoListComponent,
  },
];
