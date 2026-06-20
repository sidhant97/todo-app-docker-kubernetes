package com.nagp.todo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Todo {
    private long id;
    @NotBlank
    private String title;
    @NotBlank
    private String priority;
    private String description;
    private Boolean completed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
