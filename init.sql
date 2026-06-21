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

INSERT INTO todo (id, title, priority, description, completed) VALUES (1, 'Complete DevOps Assignment', 'High', 'Deploy Spring Boot and MySQL multi-tier app to GKE cluster', FALSE);
INSERT INTO todo (id, title, priority, description, completed) VALUES (2, 'Optimize Database Indexes', 'High', 'Analyze slow query logs and add indexes to the user_sessions table', FALSE);
INSERT INTO todo (id, title, priority, description, completed) VALUES (3, 'Set up Prometheus Alerts', 'Medium', 'Configure Slack notifications for high CPU utilization on production pods', TRUE);
INSERT INTO todo (id, title, priority, description, completed) VALUES (4, 'Fix React Memory Leak', 'Medium', 'Resolve the useEffect dependency array issue causing infinite re-renders', FALSE);
INSERT INTO todo (id, title, priority, description, completed) VALUES (5, 'Update API Documentation', 'Low', 'Generate updated Swagger/OpenAPI specs for the v2 auth endpoints', TRUE);
              
ON DUPLICATE KEY UPDATE id=id;