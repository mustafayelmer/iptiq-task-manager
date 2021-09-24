# iptiQ - Task Manager Project

A software component that is designed for handling multiple processes inside an operating system

## Standards
- Language: `TS`
- Eslint: `Yes`
- Static Code Analysis: `Yes` *IntelliJ Code Inspections*
- DDD - Document Driven: `Yes`
- DDD - Domain Driven: `Yes`
- EDD - Exception Driven: `Yes`
- TDD - Test Driven: `Yes` [go to test folder](./test/)
- LDD - Log Driven: `No`
- 12FA - 12 Factor-App: `50%` *Partially*

## Commands
- ``npm run clear`` *// clears "dist" folder*
- ``npm run lint`` *// runs eslint for static code analysis*
- ``npm run test`` *// runs test files in "test" folder*
- ``npm run build`` *// builds JS files at "dist" folder*
- ``npm run publix`` *// publishes "dist" folder to npm*

## Dependencies
- ``uuid`` *to generate unique pid*

## Install
``npm i @yelmer-samples/iptiq-task-manager``

## Samples

### Import
````javascript
const {taskManager} = require('@yelmer-samples/iptiq-task-manager');
// ES6: import {taskManager} from "@yelmer-samples/iptiq-task-manager";
````

### Initialize
> Initializes the task manager with core attributes
>
> **Default** - capacity is `1000`
>
> **Default** - mode is `default`
>
````javascript
/**
* @param {number} capacity - first parameter
* @param {('default'|'fifo'|'priority')} mode - second parameter
* 
* @returns {void}
* 
* @throws {InvalidCapacityError} - if capacity is not valid positive integer
* @throws {InvalidModeError} - if mode is not any of [default, fifo, priority]
*/
taskManager.initialize(1000, 'default');
````

### Reset
> Reset mode in runtime
>
> **Note** - Clears all tasks (or kill)
>
````javascript
/**
* 
* @param {('default'|'fifo'|'priority')} mode
* 
* @returns {void}
* 
* @throws {InvalidModeError} - if mode is not any of [default, fifo, priority]
*/
taskManager.resetMode('default');
````
### Reset Capacity
> Initializes the task manager with core attributes
>
> **Note** - Clears all tasks (or kill)
>

````javascript
/**
* @param {number} capacity
* 
* @returns {void}
* 
* @throws {InvalidCapacityError} - if capacity is not valid positive integer
*/
taskManager.resetCapacity(1000);
````


### Add
> Creates a new task with given priority
>
````javascript
/**
* @param {{priority: 'low'|'medium'|'high'}} dto
* 
* @returns {TaskItem} - {pid: string, priority: 'low'|'medium'|'high', createdAt: number}
* 
* @throws {InvalidPriorityError} - if priority is not any of [low, medium, high]
* @throws {MaximumCapacityError} - if maxium capacity is reached when mode:default
*/
const task = taskManager.add({priority: 'low'});
````

### List
> Lists all tasks with sorting createdAt
>
````javascript
/**
* @param nothing
* 
* @returns {Array<TaskItem>} - Array<{pid: string, priority: 'low'|'medium'|'high', createdAt: number}>
* 
* @throws nothing
* 
* @todo pagination, offset, page 
*/

const tasks = taskManager.list();
````

### Kill All
> Kills/removes all tasks
>
````javascript
/**
* @param nothing
* 
* @returns {number} - killed task count
* 
* @throws nothing
*/

const killedCount = taskManager.killAll();
````

### Kill by Group
> Kills/removes tasks which' priority equals to given
>
````javascript
/**
* @param {('low'|'medium'|'high')} priority
* 
* @returns {number} - killed task count
* 
* @throws nothing
*/
const killedCount = taskManager.killGroup('medium');
````

### Kill by Pid
> Kills/removes task with given pid
>
````javascript
/**
* @param {string} pid
* 
* @returns {boolean} - is task killed?
* 
* @throws nothing
*/
const isKilled = taskManager.kill('e85ade4f-f170-49b4-87ca-132de86b2c5f');
````

### Kill Direct
> Kills/removes selected task
>
````javascript
/**
* @param nothing
* 
* @returns {boolean} - is task killed?
* 
* @throws nothing
*/
const isKilled = taskManager.items[0].kill();
````

### Get properties
> Returns readonly properties
>
````javascript
/**
* @returns {('default'|'fifo'|'priority')} - current mode
*/
const mode = taskManager.mode;

/**
* @returns {number} - current task capacity
*/
const capacity = taskManager.capacity;

/**
* @returns {Array<TaskItem>} - tasks
*/
const items = taskManager.items;

/**
* @returns {number} - short-cut for taskManager.items.length 
*/
const size = taskManager.size;

/**
* @returns {boolean} - short-cut for taskManager.items.length >= taskManager.capacity
*/
const isOverloaded = taskManager.isOverloaded;
````

---
### Prepare by
- Mustafa Yelmer
- mustafayelmer(at)gmail.com
- `2021-09-21`