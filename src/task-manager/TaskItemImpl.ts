import {TaskItem, TaskManager} from "./interfaces";
import {checkTaskPriority, TaskPriority} from "./TaskPriority";
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
        this._priority = checkTaskPriority(priority, TaskPriority.LOW, true);
        this._createdAt = manager.generateTimestamp();
        this._pid = uuid.v4();
        this._manager = manager;
    }
    kill(): void {
        this._manager.kill(this._pid);
    }

    /**
     * To ignore manager attribute, json stringify method is overridden
     * @override
     * */
    toJSON(): TaskItem {
        return this.toPrint();
    }
    toPrint(): TaskItem {
        return {
            createdAt: this._createdAt,
            pid: this._pid,
            priority: this._priority,
        } as TaskItem;
    }
}