import {TaskAdapter, TaskAddDto, TaskItem, TaskManager} from "../interfaces";
import {TaskItemImpl} from "../TaskItemImpl";
import {MaximumCapacityError} from "../errors";

export class TaskModeDefault implements TaskAdapter {

    add(manager: TaskManager, dto: TaskAddDto): TaskItem {
        if (manager.isOverloaded) {
            throw new MaximumCapacityError(manager.capacity);
        }
        const item = new TaskItemImpl(manager, dto?.priority);
        manager.items.push(item);
        return item;
    }
    
}