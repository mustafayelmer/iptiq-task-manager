import {TaskMode} from "./TaskMode";
import {TaskPriority} from "./TaskPriority";

export interface TaskAdapter {
    add(manager: TaskManager, dto: TaskAddDto): TaskItem;
}
export interface TaskManager {
    mode: TaskMode;
    capacity: number;
    items: Array<TaskItem>;
    size: number;
    isOverloaded: boolean;

    initialize(capacity?: number, mode?: TaskMode): void;
    add(dto?: TaskAddDto): TaskItem;
    list(): Array<TaskItem>;
    kill(pid: string): boolean;
    killGroup(priority: TaskPriority): number;
    killAll(): number;
    resetMode(mode: TaskMode): number;
    resetCapacity(capacity: number): number;
    // for only testing
    generateTimestamp(): number;
    toPrint(): TaskManager;
}
export interface TaskItem {
    createdAt: number;
    pid: string;
    priority: TaskPriority;
    kill(): void;
    toPrint(): TaskItem;
}
export interface TaskAddDto {
    priority?: TaskPriority;
}