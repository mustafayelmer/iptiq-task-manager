import {TaskAdapter, TaskAddDto, TaskItem, TaskManager} from "../interfaces";
import {TaskItemImpl} from "../TaskItemImpl";
import {MaximumCapacityError} from "../errors";

export class TaskModeFifo implements TaskAdapter {

    add(manager: TaskManager, dto: TaskAddDto): TaskItem {
        while (manager.isOverloaded) {
            manager.items.shift();
        }
        const item = new TaskItemImpl(manager, dto?.priority);
        manager.items.push(item);
        return item;
    }

}