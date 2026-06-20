package com.nagp.todo.service;

import com.nagp.todo.dto.Todo;
import com.nagp.todo.exception.InvalidTodoException;

import java.util.List;

public interface TodoService {
    List<Todo> getAllTodos();
    List<Todo> getPendingTodos();
    List<Todo> getFinishedTodos();
    Todo addTodo(Todo todo) throws InvalidTodoException;
    boolean deleteTodo(long id);
    Boolean finishTodo(long id);
}
