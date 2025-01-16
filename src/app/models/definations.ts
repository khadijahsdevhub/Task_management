export interface Task {
    id: number;
    title: string;
    category: string;
    priority: string;
    dueDate?: Date;
    dueTime?: Date;
    completed: boolean;
}
