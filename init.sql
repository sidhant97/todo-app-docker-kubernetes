CREATE DATABASE IF NOT EXISTS todo_db;
USE todo_db;

CREATE TABLE IF NOT EXISTS todo (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    priority VARCHAR(50),
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO todo (id, title, priority, description, completed) VALUES 
(1, 'title -1', 'High', 'This is a high priority todo', FALSE),
(2, 'title -2', 'Medium', 'This is a medium priority todo', TRUE),
(3, 'title -3', 'Low', 'This is a low priority todo', FALSE),
(4, 'title -4', 'High', 'This is a high priority todo', TRUE),
(5, 'title -5', 'Medium', 'This is a medium priority todo', FALSE)
ON DUPLICATE KEY UPDATE id=id;