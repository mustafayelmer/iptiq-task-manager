import {checkTaskMode, TaskMode} from "./TaskMode";
import {TaskPriority} from "./TaskPriority";
import {TaskAdapter, TaskAddDto, TaskItem, TaskManager} from "./interfaces";
import {TaskModeDefault} from "./mode-adapter/TaskModeDefault";
import {TaskModeFifo} from "./mode-adapter/TaskModeFifo";
import {TaskModePriority} from "./mode-adapter/TaskModePriority";
import {AlreadyInitializedError, InvalidCapacityError} from "./errors";

// noinspection JSUnusedGlobalSymbols
/**
 * Task Manager
 * Holds all
 * @class TaskManager
 * @abstract
 * */
export class TaskManagerImpl implements TaskManager {
    private _mode: TaskMode;
    private _capacity: number;
    private _items: Array<TaskItem>;
    private _initialized: boolean;
    private _adapter: TaskAdapter;
    private _adapters: Map<TaskMode, TaskAdapter>;

    constructor() {
        this._adapters = new Map<TaskMode, TaskAdapter>();
        this._adapters.set(TaskMode.DEFAULT, new TaskModeDefault());
        this._adapters.set(TaskMode.FIFO, new TaskModeFifo());
        this._adapters.set(TaskMode.PRIORITY, new TaskModePriority());
        this._capacity = 1000;
        this._mode = TaskMode.DEFAULT;
        this._adapter = this._adapters.get(this._mode);
        this._items = [];
        this._initialized = false;
    }
    /**
     * @inherited
     * */
    public initialize(capacity?: number, mode?: TaskMode): void {
        if (this._initialized) {
            throw new AlreadyInitializedError();
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
            throw new InvalidCapacityError(capacity);
        }
    }
    private _setMode(mode: TaskMode): void {
        if (this._mode === mode) {
            return;
        }
        this._mode = checkTaskMode(mode, TaskMode.DEFAULT, true);
        this._adapter = this._adapters.get(this._mode);
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

    add(dto?: TaskAddDto): TaskItem {
        return this._adapter.add(this, dto);
    }

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

    generateTimestamp(): number {
        return new Date().getTime();
    }

    get isOverloaded(): boolean {
        return (this.items.length >= this._capacity);
    }

    toPrint(): TaskManager {
        return {
            mode: this._mode,
            capacity: this._capacity,
            items: this._items.map(item => item.toPrint()),
            size: this.size,
        } as TaskManager;
    }
}