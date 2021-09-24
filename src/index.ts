// region environment-casting
import * as dotenv from "dotenv";
dotenv.config();
try {
    // validate capacity value is integer or null
    process.env.TM_CAPACITY = parseInt(process.env.TM_CAPACITY as string, 10).toString(10);
} catch (e) {
    process.env.TM_CAPACITY = null;
}
try {
    // validate mode value is string or null
    process.env.TM_MODE = (typeof process.env.TM_MODE === 'string') ? process.env.TM_MODE : null;
} catch (e) {
    process.env.TM_MODE = null;
}
// endregion environment-casting

import {TaskManagerImpl} from "./task-manager/TaskManagerImpl";
import {TaskMode} from "./task-manager/TaskMode";
import {TaskPriority} from "./task-manager/TaskPriority";

const taskManager = new TaskManagerImpl();
export {taskManager, TaskMode, TaskPriority};