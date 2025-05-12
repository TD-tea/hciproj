export interface User {
    id: number;
    email: string;
    password: string;
    tasks: Task[];
}

export interface Task {
    id: number;
    text: string;
    points: number;
    completed: boolean;
    assignedTo?: string; // Name of the family member assigned
} 