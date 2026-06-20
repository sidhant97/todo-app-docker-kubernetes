export interface Todo {
    id?: number;
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    description?: string;
    completed?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}