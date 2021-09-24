import {TaskManagerImpl} from "./task-manager/TaskManagerImpl";
import {TaskMode} from "./task-manager/TaskMode";
import {TaskPriority} from "./task-manager/TaskPriority";

const taskManager = new TaskManagerImpl();
export {taskManager, TaskMode, TaskPriority};