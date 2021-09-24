import {strict as assert} from 'assert';
import * as uuid from 'uuid';
import {taskManager, TaskMode, TaskPriority} from "../src";
import {TaskItem} from "../src/task-manager/interfaces";

// region test-specific
let fakeTime = new Date().getTime();
const TASK_SIZE = 5;


/**
 * To implement successive time (incremental time)
 * */
taskManager.generateTimestamp = () :number => {
    const current = fakeTime;
    fakeTime++;
    return current;
}

const priorities = Object.values(TaskPriority);
function randomPriority(): TaskPriority {
    return priorities[Math.floor(Math.random() * priorities.length)];
}

// endregion test-specific

describe('initialize', () => {
    it(`capacity should be default: ${process.env.TM_CAPACITY}`, () => {
        assert.strictEqual(taskManager.capacity, parseInt(process.env.TM_CAPACITY));
    });
    it(`mode should be default: ${process.env.TM_MODE}`, () => {
        assert.strictEqual(taskManager.mode, process.env.TM_MODE);
    });
    it('task size should be zero (task array is empty)', () => {
        assert.strictEqual(taskManager.size, 0);
    });
    it('setting capacity should not raise an error', () => {
        assert.doesNotThrow(() => {
            taskManager.resetCapacity(5);
        });
    });
    it('capacity should be set', () => {
        assert.strictEqual(taskManager.capacity, TASK_SIZE);
    });
    it(`task manager should be initialized (reset mode & capacity)`, () => {
        assert.doesNotThrow(() => {
            taskManager.initialize(TASK_SIZE, TaskMode.DEFAULT);
        });
    });
});
describe('mode: shared', () => {
    it(`invalid priority should raise an error`, () => {
        assert.throws(() => {
            taskManager.add({priority: 'foo-bar' as TaskPriority});
        });
    });
    let item: TaskItem = null;
    it(`new task should be success`, () => {
        assert.doesNotThrow(() => {
            item = taskManager.add({priority: TaskPriority.MEDIUM});
        });
    });
    it(`size should be incremented`, () => {
        assert.strictEqual(taskManager.size, 1);
    });
    it(`mode should be equal to given`, () => {
        assert.strictEqual(item.priority, TaskPriority.MEDIUM);
    });
    it(`id format should be an uuid`, () => {
        assert.strictEqual(uuid.validate(item.pid), true);
    });
    it(`created time should be generated before now`, () => {
        assert.equal(item.createdAt < fakeTime, true);
    });

});

describe('mode: default', () => {
    it(`clear tasks`, () => {
        assert.doesNotThrow(() => {
            taskManager.killAll();
        });
    });
    describe('add', () => {
        for (let i = 1; i <= 5; i++) {
            const priority = randomPriority();
            it(`task ${i} > ${priority}`, () => {
                assert.doesNotThrow(() => {
                    taskManager.add({priority: priority});
                });
            });
        }
    });
    describe('mode: default - overload', () => {
        it(`created at should be incrementing, and id should be unique`, () => {
            // to check duplicated id
            const ids: Array<string> = [];
            // to check create time is incrementing
            let lastCreatedAt: number = 0;
            let createdAtError = false;
            let duplicatedIdError = false;
            for (const item of taskManager.items) {
                if (ids.includes(item.pid)) {
                    console.log('pid', {item: item.toPrint(), ids});
                    duplicatedIdError = true;
                }
                ids.push(item.pid);
                if (lastCreatedAt >= item.createdAt) {
                    console.log('createdAt', {item: item.toPrint(), lastCreatedAt});
                    createdAtError = true
                }
                lastCreatedAt = item.createdAt;
            }
            assert.strictEqual(createdAtError, false);
            assert.strictEqual(duplicatedIdError, false);
        });
        it(`isOverloaded should be return true`, () => {
            assert.strictEqual(taskManager.isOverloaded, true);
        });
        it(`if isOverloaded then add new task should raise an error`, () => {
            assert.throws(() => {
                taskManager.add({priority: TaskPriority.MEDIUM});
            });
        });
    });

});

describe('reset Mode: default > fifo', () => {
    it('setting mode should not raise an error', () => {
        assert.doesNotThrow(() => {
            taskManager.resetMode(TaskMode.FIFO);
        });
    });
    it(`mode should be fifo`, () => {
        assert.strictEqual(taskManager.mode, TaskMode.FIFO);
    });
    it('task size should be zero (task array is empty)', () => {
        assert.strictEqual(taskManager.size, 0);
    });
});

describe('mode: fifo', () => {
    for (let i = 1; i <= 5; i++) {
        const priority = randomPriority();
        it(`add-${i} > ${priority}`, () => {
            assert.doesNotThrow(() => {
                taskManager.add({priority: priority});
            });
            assert.strictEqual(taskManager.size, i);
            assert.strictEqual(taskManager.items[i - 1].priority, priority);
        });
    }
});
describe('mode: fifo - overload', () => {
    it(`isOverloaded should be return true`, () => {
        assert.strictEqual(taskManager.isOverloaded, true);
    });
    const firstTask = {...taskManager.items[0]};
    it(`if isOverloaded then add new task should not raise an error`, () => {
        assert.doesNotThrow(() => {
            taskManager.add({priority: TaskPriority.MEDIUM});
        });
    });
    it(`first item should be removed`, () => {
        assert.notStrictEqual(taskManager.items[0].pid, firstTask.pid);
    });
    it(`size should be same`, () => {
        assert.strictEqual(taskManager.size, 5);
    });
});

describe('reset Mode: fifo > priority', () => {
    it('setting mode should not raise an error', () => {
        assert.doesNotThrow(() => {
            taskManager.resetMode(TaskMode.PRIORITY);
        });
    });
    it(`mode should be priority`, () => {
        assert.strictEqual(taskManager.mode, TaskMode.PRIORITY);
    });
    it('task size should be zero (task array is empty)', () => {
        assert.strictEqual(taskManager.size, 0);
    });
});

describe('mode: priority with ignoring case', () => {
    for (let i = 1; i <= 5; i++) {
        const priority = TaskPriority.HIGH;
        it(`add-${i} > ${priority}`, () => {
            assert.doesNotThrow(() => {
                taskManager.add({priority: priority});
            });
            assert.strictEqual(taskManager.size, i);
            assert.strictEqual(taskManager.items[i - 1].priority, priority);
        });
    }
});
