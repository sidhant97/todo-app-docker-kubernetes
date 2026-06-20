package com.nagp.todo.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidTodoException.class)
    public ResponseEntity<?> handleInvalid(InvalidTodoException ex) {
        return ResponseEntity.badRequest().body(Map.of(
                "error", "InvalidTodoException",
                "message", ex.getMessage()
        ));
    }
}
