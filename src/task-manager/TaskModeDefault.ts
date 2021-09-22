import {TaskManager} from "./TaskManager";
import {TaskAddDto} from "./TaskAddDto";
import {TaskItem} from "./TaskItem";

export class TaskModeDefault extends TaskManager {

    add(madto?: TaskAddDto): TaskItem {
        return undefined;
    }
    
}