import {InvalidPriorityError} from "./errors";

export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}
export function checkTaskPriority(value: TaskPriority, def: TaskPriority = null, throwing = false): TaskPriority {
    if ([undefined, null].includes(value) && def) {
        return def;
    } else if (typeof value === 'string' && Object.values(TaskPriority).includes(value)) {
        return value as TaskPriority;
    } else if (throwing) {
        throw new InvalidPriorityError(value);
    }
    return null;
}