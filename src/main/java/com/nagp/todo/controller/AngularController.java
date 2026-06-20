package com.nagp.todo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AngularController {
    @GetMapping(value = {"/", "/{path:[^\\.]*}"})
    public String forwardAngularRoutes() {
        return "forward:/index.html";
    }
}