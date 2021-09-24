import {InvalidModeError} from "./errors";

export enum TaskMode {
    DEFAULT = 'default',
    FIFO = 'fifo',
    PRIORITY = 'priority',
}
export function checkTaskMode(value: TaskMode, def: TaskMode = null, throwing = false): TaskMode {
    if ([undefined, null].includes(value) && def) {
        return def;
    } else if (typeof value === 'string' && Object.values(TaskMode).includes(value)) {
        return value as TaskMode;
    } else if (throwing) {
        throw new InvalidModeError(value);
    }
    return null;
}