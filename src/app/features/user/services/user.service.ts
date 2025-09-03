import { signal } from '@angular/core';
import { User } from '../../auth/models/user.model';
import { computed } from '@angular/core';

export class UserService {
  private currentUser = signal<User | null>(null);

  // Signal avec validation
  public isAdmin = computed(() => this.currentUser()?.role === 'admin');

  public canEditTodos = computed(
    () => this.currentUser() && (this.isAdmin() || this.currentUser()?.role === 'user'),
  );
}
