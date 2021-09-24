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
            taskManager.resetCapacity(TASK_SIZE);
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
    describe('on-begin', () => {
        it(`clear tasks should not raise en error`, () => {
            assert.doesNotThrow(() => {
                taskManager.killAll();
            });
        });
        it(`task size should be zero`, () => {
            assert.strictEqual(taskManager.size, 0);
        });
    });
    describe('add()', () => {
        for (let i = 1; i <= TASK_SIZE; i++) {
            const priority = randomPriority();
            it(`task ${i} > ${priority}`, () => {
                assert.doesNotThrow(() => {
                    taskManager.add({priority: priority});
                });
            });
        }
    });
    describe('on-end', () => {
        it(`task size should be ${TASK_SIZE}`, () => {
            assert.strictEqual(taskManager.size, TASK_SIZE);
        });
        it(`created at should be incrementing, and id should be unique`, () => {
            // to check duplicated id
            const ids: Array<string> = [];
            // to check create time is incrementing
            let lastCreatedAt: number = 0;
            let createdAtError = false;
            let duplicatedIdError = false;
            for (const item of taskManager.items) {
                if (ids.includes(item.pid)) {
                    duplicatedIdError = true;
                }
                ids.push(item.pid);
                if (lastCreatedAt >= item.createdAt) {
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

describe('mode: fifo', () => {
    describe('on-begin', () => {
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
    describe('add()', () => {
        for (let i = 1; i <= TASK_SIZE; i++) {
            const priority = randomPriority();
            it(`task ${i} > ${priority}`, () => {
                assert.doesNotThrow(() => {
                    taskManager.add({priority: priority});
                });
            });
        }
    });
    describe('on-end', () => {
        it(`task size should be ${TASK_SIZE}`, () => {
            assert.strictEqual(taskManager.size, TASK_SIZE);
        });
        it(`isOverloaded should be return true`, () => {
            assert.strictEqual(taskManager.isOverloaded, true);
        });
        let firstPid: string = null;
        it(`if isOverloaded then add new task should not raise an error`, () => {
            firstPid = taskManager.items[0].pid;
            assert.doesNotThrow(() => {
                taskManager.add({priority: TaskPriority.MEDIUM});
            });
        });
        it(`first item should be removed`, () => {
            assert.notStrictEqual(taskManager.items[0].pid, firstPid);
        });
        it(`size should be same`, () => {
            assert.strictEqual(taskManager.size, TASK_SIZE);
        });
    });
});

describe('mode: priority (skip case)', () => {
    describe('on-begin', () => {
        it('setting mode should not raise an error', () => {
            assert.doesNotThrow(() => {
                taskManager.resetMode(TaskMode.PRIORITY);
            });
        });
        it(`mode should be fifo`, () => {
            assert.strictEqual(taskManager.mode, TaskMode.PRIORITY);
        });
        it('task size should be zero (task array is empty)', () => {
            assert.strictEqual(taskManager.size, 0);
        });
    });
    describe('add()', () => {
        for (let i = 1; i <= TASK_SIZE; i++) {
            const priority = TaskPriority.HIGH;
            it(`task ${i} > ${priority}`, () => {
                assert.doesNotThrow(() => {
                    taskManager.add({priority: priority});
                });
            });
        }
    });
    describe('on-end', () => {
        it(`task size should be ${TASK_SIZE}`, () => {
            assert.strictEqual(taskManager.size, TASK_SIZE);
        });
        it(`isOverloaded should be return true`, () => {
            assert.strictEqual(taskManager.isOverloaded, true);
        });

        it(`add operation should be skipped`, () => {
            assert.strictEqual(taskManager.add({priority: TaskPriority.HIGH}), null);
        });
        it(`size should be same`, () => {
            assert.strictEqual(taskManager.size, TASK_SIZE);
        });
    });
});
describe('mode: priority (override case)', () => {
    describe('on-begin', () => {
        it(`clear tasks should not raise en error`, () => {
            assert.doesNotThrow(() => {
                taskManager.killAll();
            });
        });
        it(`task size should be zero`, () => {
            assert.strictEqual(taskManager.size, 0);
        });
    });
    describe('add()', () => {
        for (let i = 1; i <= TASK_SIZE; i++) {
            const priority = TaskPriority.LOW;
            it(`task ${i} > ${priority}`, () => {
                assert.doesNotThrow(() => {
                    taskManager.add({priority: priority});
                });
            });
        }
    });
    describe('on-end', () => {
        it(`task size should be ${TASK_SIZE}`, () => {
            assert.strictEqual(taskManager.size, TASK_SIZE);
        });
        it(`isOverloaded should be return true`, () => {
            assert.strictEqual(taskManager.isOverloaded, true);
        });
        let firstPid: string = null;
        it(`if isOverloaded then add new task should not raise an error`, () => {
            firstPid = taskManager.items[0].pid;
            assert.doesNotThrow(() => {
                taskManager.add({priority: TaskPriority.HIGH});
            });
        });
        it(`first item (with low priority) should be removed`, () => {
            assert.notStrictEqual(taskManager.items[0].pid, firstPid);
        });
        it(`size should be same`, () => {
            assert.strictEqual(taskManager.size, TASK_SIZE);
        });
    });
});

describe('kill & list', () => {
    describe('killAll()', () => {
        it(`clear tasks should not raise en error`, () => {
            assert.doesNotThrow(() => {
                taskManager.killAll();
            });
        });
        it(`set Capacity, doubling size to test kill by priority`, () => {
            assert.doesNotThrow(() => {
                taskManager.resetCapacity(TASK_SIZE * 2);
            });
        });
    });
    describe('add()', () => {
        for (let i = 1; i <= TASK_SIZE; i++) {
            const priority = TaskPriority.LOW;
            it(`task ${i} > ${priority}`, () => {
                assert.doesNotThrow(() => {
                    taskManager.add({priority: priority});
                });
            });
        }
        for (let i = 1; i <= TASK_SIZE; i++) {
            const priority = TaskPriority.MEDIUM;
            it(`task ${i} > ${priority}`, () => {
                assert.doesNotThrow(() => {
                    taskManager.add({priority: priority});
                });
            });
        }
    });
    describe('list()', () => {
        let items: Array<TaskItem> = [];
        it(`list should not raise an error`, () => {
            assert.doesNotThrow(() => {
                items = taskManager.list();
            });
        });
        it(`tasks should be create time ordered`, () => {
            let prevCreatedAt: number = 0;
            let createdAtError = false;
            for (const item of taskManager.items) {
                if (prevCreatedAt >= item.createdAt) {
                    createdAtError = true
                }
                prevCreatedAt = item.createdAt;
            }
            assert.strictEqual(createdAtError, false);
        });
    });
    describe('killGroup()', () => {
        let deletedCount = 0;
        it(`clear by priority should not raise en error`, () => {
            assert.doesNotThrow(() => {
                deletedCount = taskManager.killGroup(TaskPriority.LOW);
            });
        });
        // because half of task is low, others medium
        it(`deleted tasks should be ${TASK_SIZE}`, () => {
            assert.strictEqual(taskManager.size, TASK_SIZE);
        });
        it(`remained tasks should be ${TASK_SIZE}`, () => {
            assert.strictEqual(taskManager.size, TASK_SIZE);
        });
    });

    describe('kill()', () => {
        let firstPid: string = null;
        it(`selected task should be killed`, () => {
            firstPid = taskManager.items[0].pid;
            assert.strictEqual(taskManager.kill(firstPid), true);
        });
        it(`deleted task should not exist`, () => {
            assert.notStrictEqual(taskManager.items[0].pid, firstPid);
        });
        it(`remained tasks should be ${TASK_SIZE - 1}`, () => {
            assert.strictEqual(taskManager.size, TASK_SIZE - 1);
        });
    });
});
