import {TaskMode} from "./TaskMode";
import {TaskPriority} from "./TaskPriority";

function _visibleTextValue(value: unknown): string {
    try {
        if (['string', 'number', 'boolean', 'bigint'].includes(typeof value)) {
            return value.toString();
        } else {
            return JSON.stringify(value);
        }
    } catch (e) {
        return (e as Error).message
    }
}

export class AlreadyInitializedError extends Error {
    constructor() {
        super(`Task manager is already initialized, please use reset methods`);
    }
}
export class InvalidCapacityError extends Error {
    constructor(value: unknown) {
        super(`Task capacity must be positive integer, but value is ${_visibleTextValue(value)}`);
    }
}
export class InvalidModeError extends Error {
    constructor(value: unknown) {
        super(`Task mode must be in [${Object.keys(TaskMode).join(', ')}], but value is ${_visibleTextValue(value)}`);
    }
}
export class InvalidPriorityError extends Error {
    constructor(value: unknown) {
        super(`Task priority must be in [${Object.keys(TaskPriority).join(', ')}], but value is ${_visibleTextValue(value)}`);
    }
}
