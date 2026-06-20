package com.nagp.todo.service;

import com.nagp.todo.dto.Todo;
import com.nagp.todo.entity.TodoEntity;
import com.nagp.todo.exception.InvalidTodoException;
import com.nagp.todo.repository.TodoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class TodoServiceImpl implements TodoService {

    private TodoRepository todoRepository;

    @Override
    public List<Todo> getAllTodos() {
        return todoRepository.findAll().stream().map(TodoServiceImpl::todoEntityToDto).toList();
    }

    private static Todo todoEntityToDto(TodoEntity entity) {
        Todo todo = new Todo();
        todo.setId(entity.getId());
        todo.setTitle(entity.getTitle());
        todo.setPriority(entity.getPriority());
        todo.setDescription(entity.getDescription());
        todo.setCompleted(entity.isCompleted());
        todo.setCreatedAt(entity.getCreatedAt());
        todo.setUpdatedAt(entity.getUpdatedAt());
        return todo;
    }

    @Override
    public List<Todo> getPendingTodos() {
        return todoRepository.findAll().stream().filter(entity -> !entity.isCompleted()).map(TodoServiceImpl::todoEntityToDto).toList();
    }

    @Override
    public List<Todo> getFinishedTodos() {
        return todoRepository.findAll().stream().filter(TodoEntity::isCompleted).map(TodoServiceImpl::todoEntityToDto).toList();
    }

    @Override
    public Todo addTodo(Todo todo) throws InvalidTodoException {
        if (isValid(todo)) {
            throw new InvalidTodoException("Invalid input: title is missing");
        }
        TodoEntity entity = new TodoEntity();
        entity.setTitle(todo.getTitle().trim());
        entity.setPriority(todo.getPriority());
        entity.setDescription(todo.getDescription());
        entity.setCompleted(false);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        return todoEntityToDto(todoRepository.save(entity));
    }

    private boolean isValid(Todo todo) {
        return !StringUtils.hasText(todo.getTitle()) || !StringUtils.hasText(todo.getPriority());
    }

    @Override
    public boolean deleteTodo(long id) {
        if (todoRepository.existsById(id)) {
            todoRepository.deleteById(id);
            return !todoRepository.existsById(id);
        }
        return false;
    }

    @Override
    public Boolean finishTodo(long id) {
        Optional<TodoEntity> todoEntityOptional = todoRepository.findById(id);
        if (todoEntityOptional.isEmpty()) return false;
        TodoEntity todoEntity = todoEntityOptional.get();
        todoEntity.setCompleted(true);
        todoEntity.setUpdatedAt(LocalDateTime.now());
        todoRepository.save(todoEntity);
        return true;
    }
}
