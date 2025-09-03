import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from '../services/todo.service';
import { of } from 'rxjs';
import 'jasmine';
// Test d'un composant avec ses dépendances
describe('TodoListComponent', () => {
  let fixture: ComponentFixture<TodoListComponent>;
  let todoService: jasmine.SpyObj<TodoService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TodoService', ['getAllTodos']);
    spy.getAllTodos.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [{ provide: TodoService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    todoService = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
  });

  it('should load todos on init', () => {
    fixture.detectChanges();
    expect(todoService.getAllTodos).toHaveBeenCalled();
  });
});
