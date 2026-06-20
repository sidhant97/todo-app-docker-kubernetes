package com.nagp.todo.controller;

import com.nagp.todo.dto.Todo;
import com.nagp.todo.exception.InvalidTodoException;
import com.nagp.todo.service.TodoService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/todos")
public class ToDoController {
    private final TodoService todoService;

    @GetMapping
    public ResponseEntity<List<Todo>> getTodos(@RequestParam(required = false) Boolean completed) {
        if (completed != null && !completed) {
            return ResponseEntity.ok(todoService.getPendingTodos());
        } else if (completed != null) {
            return ResponseEntity.ok(todoService.getFinishedTodos());
        } else {
            return ResponseEntity.ok(todoService.getAllTodos());
        }
    }

    @PutMapping("/todo/add")
    public ResponseEntity<Todo> addTodo(@Valid @RequestBody Todo todo) throws InvalidTodoException {
        return ResponseEntity.ok(todoService.addTodo(todo));
    }

    @DeleteMapping("/todo/{id}/delete")
    public ResponseEntity<Boolean> deleteTodo(@PathVariable long id) {
        return ResponseEntity.ok(todoService.deleteTodo(id));
    }

    @GetMapping("/todo/{id}/finish")
    public ResponseEntity<Boolean> finishTodo(@PathVariable long id) {
        return ResponseEntity.ok(todoService.finishTodo(id));
    }
}
