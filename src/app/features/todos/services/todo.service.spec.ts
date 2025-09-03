// src/app/features/todos/services/todo.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';
import 'jasmine';
describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty todos', () => {
    expect(service.getTodos().length).toBe(0);
  });

  it('should add todo correctly', async () => {
    const todoRequest = {
      title: 'Test Todo',
      description: 'Test Description',
      priority: 'medium' as const,
    };

    await service.createTodo(todoRequest);
    expect(service.getTodos().length).toBe(1);
    expect(service.getTodos()[0].title).toBe('Test Todo');
    expect(service.getTodos()[0].description).toBe('Test Description');
    expect(service.getTodos()[0].status).toBe('todo');
    expect(service.getTodos()[0].priority).toBe('medium');
  });

  it('should compute completed todos correctly', async () => {
    // Clear existing todos first
    const existingTodos = service.getTodos();
    for (const todo of existingTodos) {
      await service.deleteTodo(todo.id);
    }

    const todo1 = await service.createTodo({
      title: 'Todo 1',
      description: 'Description 1',
      priority: 'low' as const,
    });

    await service.createTodo({
      title: 'Todo 2',
      description: 'Description 2',
      priority: 'medium' as const,
    });

    // Update todo1 to completed
    if (todo1) {
      await service.updateTodo(todo1.id, { status: 'done' });
    }

    expect(service.completedTodos().length).toBe(1);
    expect(service.completedTodos()[0].id).toBe(todo1?.id);
  });

  it('should compute pending todos correctly', async () => {
    // Clear existing todos first
    const existingTodos = service.getTodos();
    for (const todo of existingTodos) {
      await service.deleteTodo(todo.id);
    }

    const todo1 = await service.createTodo({
      title: 'Todo 1',
      description: 'Description 1',
      priority: 'low' as const,
    });

    const todo2 = await service.createTodo({
      title: 'Todo 2',
      description: 'Description 2',
      priority: 'medium' as const,
    });

    // Update todo2 to in-progress
    if (todo2) {
      await service.updateTodo(todo2.id, { status: 'in-progress' });
    }

    expect(service.pendingTodos().length).toBe(1);
    expect(service.pendingTodos()[0].id).toBe(todo1?.id);
  });

  it('should compute in-progress todos correctly', async () => {
    // Clear existing todos first
    const existingTodos = service.getTodos();
    for (const todo of existingTodos) {
      await service.deleteTodo(todo.id);
    }

    await service.createTodo({
      title: 'Todo 1',
      description: 'Description 1',
      priority: 'low' as const,
    });

    const todo2 = await service.createTodo({
      title: 'Todo 2',
      description: 'Description 2',
      priority: 'medium' as const,
    });

    // Update todo2 to in-progress
    if (todo2) {
      await service.updateTodo(todo2.id, { status: 'in-progress' });
    }

    expect(service.inProgressTodos().length).toBe(1);
    expect(service.inProgressTodos()[0].id).toBe(todo2?.id);
  });

  it('should compute stats correctly', async () => {
    // Clear existing todos first
    const existingTodos = service.getTodos();
    for (const todo of existingTodos) {
      await service.deleteTodo(todo.id);
    }

    const todo1 = await service.createTodo({
      title: 'Todo 1',
      description: 'Description 1',
      priority: 'high' as const,
    });

    await service.createTodo({
      title: 'Todo 2',
      description: 'Description 2',
      priority: 'medium' as const,
    });

    const todo3 = await service.createTodo({
      title: 'Todo 3',
      description: 'Description 3',
      priority: 'high' as const,
    });

    // Update statuses
    if (todo1) await service.updateTodo(todo1.id, { status: 'done' });
    if (todo3) await service.updateTodo(todo3.id, { status: 'in-progress' });

    const stats = service.todoStats();
    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(1);
    expect(stats.pending).toBe(1);
    expect(stats.inProgress).toBe(1);
    expect(stats.highPriority).toBe(2);
    expect(stats.completionRate).toBe(33.33333333333333);
  });
});
