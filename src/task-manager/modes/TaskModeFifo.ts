import {TaskAdapter, TaskAddDto, TaskItem, TaskManager} from "../interfaces";
import {TaskItemImpl} from "../TaskItemImpl";

export class TaskModeFifo implements TaskAdapter {

    add(manager: TaskManager, dto: TaskAddDto): TaskItem {
        const item = new TaskItemImpl(manager, dto?.priority);
        manager.items.push(item);
        return item;
    }

}