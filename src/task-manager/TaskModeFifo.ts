import {TaskManager} from "./TaskManager";
import {TaskAddDto} from "./TaskAddDto";
import {TaskItem} from "./TaskItem";

export class TaskModeFifo extends TaskManager {

    add(dto?: TaskAddDto): TaskItem {
        return undefined;
    }
    
}