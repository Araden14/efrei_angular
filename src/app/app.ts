import { Component, signal } from '@angular/core';
import { TodoListComponent } from './features/todos/components/todo-list.component';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [TodoListComponent, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('todo-list-app');
}
