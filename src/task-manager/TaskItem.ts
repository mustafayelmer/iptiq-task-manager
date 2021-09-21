import {TaskPriority} from "./TaskPriority";

export interface TaskItem {
    createdAt: number;
    pid: string;
    priority: TaskPriority;
}