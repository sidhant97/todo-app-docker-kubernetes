import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgClass } from '@angular/common';
import { Observable } from 'rxjs';
import { Todo } from '../model/todo.model';
import { TodoService } from '../service/todo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, NgClass],
  templateUrl: './app.component.html',
  styles: [`
    .app-container {
      font-family: 'Segoe UI', Roboto, sans-serif;
      background-color: #f8fafc;
      min-height: 100vh;
      color: #1e293b;
      padding: 2rem;
      box-sizing: border-box;
    }
    .app-header {
      margin-bottom: 2.5rem;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 1rem;
    }
    .app-header h1 {
      font-size: 2.25rem;
      margin: 0;
      color: #0f172a;
    }
    .app-header p {
      color: #64748b;
      margin: 0.5rem 0 0 0;
    }
    .main-content {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 2rem;
    }
    @media (max-width: 992px) {
      .main-content { grid-template-columns: 1fr; }
    }
    .card {
      background: #ffffff;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }
    .form-group input, .form-group select, .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
      box-sizing: border-box;
    }
    .error-msg { color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem; }
    .board-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    @media (max-width: 768px) {
      .board-section { grid-template-columns: 1fr; }
    }
    .board-column {
      background-color: #f1f5f9;
      border-radius: 12px;
      padding: 1.25rem;
      min-height: 500px;
    }
    .column-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .count-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 700;
    }
    .pending-bg { background-color: #e0e7ff; color: #4338ca; }
    .done-bg { background-color: #d1fae5; color: #065f46; }
    .task-list { display: flex; flex-direction: column; gap: 1rem; }
    .task-card {
      background: #ffffff;
      border-radius: 8px;
      padding: 1.25rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    .task-completed {
      background-color: #fafafa;
      border-left: 4px solid #10b981;
      opacity: 0.85;
    }
    .task-completed .task-title {
      text-decoration: line-through;
      color: #94a3b8;
    }
    .task-title { margin: 0.5rem 0; color: #0f172a; }
    .task-desc { color: #64748b; font-size: 0.9rem; margin-bottom: 1rem; }
    .badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }
    .badge-high { background-color: #fee2e2; color: #991b1b; }
    .badge-medium { background-color: #fef3c7; color: #92400e; }
    .badge-low { background-color: #dbeafe; color: #1e40af; }
    .badge-completed { background-color: #e2e8f0; color: #475569; }
    .task-actions {
      display: flex;
      gap: 0.5rem;
      border-top: 1px solid #f1f5f9;
      padding-top: 0.75rem;
    }
    .justify-end { justify-content: flex-end; }
    .btn {
      padding: 0.6rem 1.2rem;
      font-weight: 600;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      width: 100%;
    }
    .btn-sm { padding: 0.4rem 0.8rem; font-size: 0.8rem; width: auto; }
    .btn-primary { background-color: #4f46e5; color: white; }
    .btn-primary:disabled { background-color: #94a3b8; }
    .btn-success { background-color: #10b981; color: white; }
    .btn-danger { background-color: #fee2e2; color: #ef4444; }
    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #94a3b8;
      border: 2px dashed #cbd5e1;
      border-radius: 8px;
    }
  `]
})
export class App implements OnInit {
  todoForm!: FormGroup;
  pendingTodos$!: Observable<Todo[]>;
  doneTodos$!: Observable<Todo[]>;

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService
  ) {}

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      priority: ['Medium', Validators.required],
      description: ['']
    });

    this.pendingTodos$ = this.todoService.pendingTodos$;
    this.doneTodos$ = this.todoService.doneTodos$;

    this.todoService.refreshTodos();
  }

  onSubmit(): void {
    if (this.todoForm.invalid) return;

    const newTodo: Todo = {
      title: this.todoForm.value.title,
      priority: this.todoForm.value.priority,
      description: this.todoForm.value.description,
      completed: false
    };

    this.todoService.addTodo(newTodo).subscribe({
      next: () => {
        this.todoForm.reset({ priority: 'Medium' });
      },
      error: (err: any) => console.error('Error adding todo:', err)
    });
  }

  markAsComplete(id: number | undefined): void {
    if (id === undefined) return;
    this.todoService.finishTodo(id).subscribe();
  }

  deleteTodo(id: number | undefined): void {
    if (id === undefined) return;
    this.todoService.deleteTodo(id).subscribe();
  }
}