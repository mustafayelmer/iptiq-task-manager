import {TaskAdapter, TaskAddDto, TaskItem, TaskManager} from "../interfaces";
import {TaskItemImpl} from "../TaskItemImpl";
import {TaskPriority} from "../TaskPriority";
import {InvalidModeError} from "../errors";

export class TaskModePriority implements TaskAdapter {

    add(manager: TaskManager, dto: TaskAddDto): TaskItem {
        while (manager.size >= manager.capacity) {
            switch (dto?.priority) {
                case TaskPriority.LOW:
                    return null;
                case TaskPriority.MEDIUM:
                    if (!this._removeLowerPriority(manager, TaskPriority.LOW)) {
                        return null;
                    }
                    break;
                case TaskPriority.HIGH:
                    if (!this._removeLowerPriority(manager, TaskPriority.LOW, TaskPriority.MEDIUM)) {
                        return null;
                    }
                    break;
                default:
                    throw new InvalidModeError(dto?.priority);
            }
        }
        const item = new TaskItemImpl(manager, dto?.priority);
        manager.items.push(item);
        return item;
    }
    private _removeLowerPriority(manager: TaskManager, ...priorities: Array<TaskPriority>): boolean {
        for (const priority of priorities) {
            const index = manager.items.findIndex((item) => item.priority === priority);
            if (index > -1) {
                manager.items.splice(index, 1);
                return true;
            }
        }
        return false;
    }

}