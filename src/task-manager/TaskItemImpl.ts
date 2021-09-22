import {TaskItem, TaskManager} from "./interfaces";
import {TaskPriority} from "./TaskPriority";
import {InvalidModeError} from "./errors";
import * as uuid from 'uuid';

export class TaskItemImpl implements TaskItem {
    private readonly _createdAt: number;
    private readonly _pid: string;
    private readonly _priority: TaskPriority;
    private readonly _manager: TaskManager;

    get createdAt(): number {
        return this._createdAt;
    }

    get pid(): string {
        return this._pid;
    }

    get priority(): TaskPriority {
        return this._priority;
    }

    constructor(manager: TaskManager, priority: TaskPriority) {
        if (priority === undefined) {
            this._priority = TaskPriority.LOW;
        } else if (typeof priority === 'string' && Object.keys(TaskPriority).includes(priority)) {
            this._priority = priority as TaskPriority;
        } else {
            throw new InvalidModeError(priority);
        }
        this._createdAt = new Date().getTime();
        this._pid = uuid.v4();
        this._manager = manager;
    }
    kill(): void {
        this._manager.kill(this._pid);
    }
}