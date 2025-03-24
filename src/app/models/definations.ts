export interface Task {
    id: string;
    title: string;
    description?: string;
    category?: string;
    priority?: string;
    dueDate?: Date | undefined| null;
    dueTime?: Date | undefined| null;
    isCompleted: boolean;
    viewDetails: boolean;
    createdAt: Date;
    completedAt: Date | null;
}
export interface Categories{
    name: string;
    icon: string;
}
