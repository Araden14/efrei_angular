// src/app/features/todos/components/todo-list.component.ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../services/todo.service';
import { AuthService } from '../../auth/services/auth.service';
import { PriorityPipe } from '../../../shared/pipes/priority.pipe';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';
import { CreateTodoRequest } from '../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PriorityPipe, HighlightDirective],
  templateUrl: './todo-list-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush, // ⚡ Optimisation
})
export class TodoListComponent {
  todoService = inject(TodoService);
  authService = inject(AuthService);

  // Form properties
  newTodo: CreateTodoRequest = {
    title: '',
    description: '',
    priority: 'medium',
    assignedTo: undefined,
  };

  // Loading state
  private addingTodoSignal = signal(false);
  addingTodo = this.addingTodoSignal.asReadonly();

  // Action loading states
  private updatingTodoSignal = signal<number | null>(null);
  updatingTodo = this.updatingTodoSignal.asReadonly();

  // ⚡ Optimisation : TrackBy pour éviter la recréation des éléments
  trackByTodoId(id: number): number {
    this.todoService.getTodos().find((todo) => todo.id === id);
    return id;
  }

  // Add new todo
  async addTodo() {
    if (!this.authService.isAuthenticated()) {
      console.log('❌ Vous devez être connecté pour créer un todo');
      return;
    }

    if (!this.newTodo.title.trim()) {
      return;
    }

    this.addingTodoSignal.set(true);

    try {
      const todoData: CreateTodoRequest = {
        ...this.newTodo,
        title: this.newTodo.title.trim(),
        description: this.newTodo.description?.trim() || '',
        assignedTo: this.authService.getCurrentUser()?.id,
      };

      const newTodo = await this.todoService.createTodo(todoData);
      console.log('✅ Todo créé avec succès:', newTodo);

      // Reset form
      this.newTodo = {
        title: '',
        description: '',
        priority: 'medium',
        assignedTo: undefined,
      };
    } catch (error) {
      console.error('❌ Erreur lors de la création du todo:', error);
    } finally {
      this.addingTodoSignal.set(false);
    }
  }

  // Start a todo (move from 'todo' to 'in-progress')
  async startTodo(todoId: number) {
    if (!this.authService.isAuthenticated()) {
      console.log('❌ Vous devez être connecté pour modifier un todo');
      return;
    }

    this.updatingTodoSignal.set(todoId);

    try {
      const updatedTodo = await this.todoService.updateTodo(todoId, {
        status: 'in-progress',
        updatedAt: new Date(),
      });

      if (updatedTodo) {
        console.log('✅ Todo démarré avec succès:', updatedTodo);
      }
    } catch (error) {
      console.error('❌ Erreur lors du démarrage du todo:', error);
    } finally {
      this.updatingTodoSignal.set(null);
    }
  }

  // Complete a todo (move from 'in-progress' to 'done')
  async completeTodo(todoId: number) {
    if (!this.authService.isAuthenticated()) {
      console.log('❌ Vous devez être connecté pour modifier un todo');
      return;
    }

    this.updatingTodoSignal.set(todoId);

    try {
      const updatedTodo = await this.todoService.updateTodo(todoId, {
        status: 'done',
        updatedAt: new Date(),
      });

      if (updatedTodo) {
        console.log('✅ Todo terminé avec succès:', updatedTodo);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la terminaison du todo:', error);
    } finally {
      this.updatingTodoSignal.set(null);
    }
  }

  // Move todo back to in-progress (from 'done' to 'in-progress')
  async reopenTodo(todoId: number) {
    if (!this.authService.isAuthenticated()) {
      console.log('❌ Vous devez être connecté pour modifier un todo');
      return;
    }

    this.updatingTodoSignal.set(todoId);

    try {
      const updatedTodo = await this.todoService.updateTodo(todoId, {
        status: 'in-progress',
        updatedAt: new Date(),
      });

      if (updatedTodo) {
        console.log('✅ Todo rouvert avec succès:', updatedTodo);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la réouverture du todo:', error);
    } finally {
      this.updatingTodoSignal.set(null);
    }
  }
}
