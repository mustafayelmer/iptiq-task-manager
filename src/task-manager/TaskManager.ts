import {TaskAddDto} from "./TaskAddDto";
import {TaskItem} from "./TaskItem";
import {TaskMode} from "./TaskMode";
import {TaskPriority} from "./TaskPriority";
import {taskManager} from "./errors";

export type TaskAddLambda = (dto?: TaskAddDto) => TaskItem;
// noinspection JSUnusedGlobalSymbols
/**
 * Task Manager
 * Holds all
 * @class TaskManager
 * @abstract
 * */
export abstract class TaskManager {
    private _mode: TaskMode;
    private _capacity: number;
    private _items: Array<TaskItem>;
    private _initialized: boolean;

    constructor() {
        this._capacity = 1000;
        this._mode = TaskMode.DEFAULT;
        this._items = [];
        this._initialized = false;
    }
    public initialize(capacity?: number, mode?: TaskMode): void {
        if (this._initialized) {
            throw new taskManager.AlreadyInitializedError();
        }
        if (capacity !== undefined) {
            this._setCapacity(capacity);
        }
        if (mode !== undefined) {
            this._setMode(mode);
        }
        this._initialized = true;
    }
    private _setCapacity(capacity: number): void {
        if (capacity === undefined) {
            this._capacity = 1000;
        } else if (Number.isInteger(capacity) && capacity > 0) {
            this._capacity = capacity;
        } else {
            throw new taskManager.InvalidCapacityError(capacity);
        }
    }
    private _setMode(mode: TaskMode): void {
        if (mode === undefined) {
            this._mode = TaskMode.DEFAULT;
        } else if (typeof mode === 'string' && Object.keys(TaskMode).includes(mode)) {
            this._mode = mode as TaskMode;
        } else {
            throw new taskManager.InvalidModeError(mode);
        }
    }
    get mode(): TaskMode {
        return this._mode;
    }

    get capacity(): number {
        return this._capacity;
    }
    get items(): Array<TaskItem> {
        return this._items;
    }
    get size(): number {
        return this._items.length;
    }
    // setter functions are banned

    abstract add(dto?: TaskAddDto): TaskItem;

    list(): Array<TaskItem> {
        const cloned = [...this._items];
        cloned.sort(function(a, b) {
            return a.createdAt - b.createdAt;
        });
        return cloned;
    }
    kill(pid: string): boolean {
        const index = this._items.findIndex((item) => item.pid === pid);
        if (index > -1) {
            this._items.splice(index, 1);
            return true;
        }
        return false;
    }
    killGroup(priority: TaskPriority): number {
        let size = 0;
        let index = this._items.findIndex((item) => item.priority === priority);
        while (index > -1) {
            size++;
            this._items.splice(index, 1);
            index = this._items.findIndex((item) => item.priority === priority);
        }
        return size;
    }
    killAll(): number {
        const size = this._items.length;
        this._items = [];
        return size;
    }
    resetMode(mode: TaskMode): number {
        this._setMode(mode);
        return this.killAll();
    }
    resetCapacity(capacity: number): number {
        this._setCapacity(capacity);
        return this.killAll();
    }
}