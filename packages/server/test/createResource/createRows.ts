// @flow
/* eslint-disable no-multi-assign,prefer-const */

import { User, Task } from '../../src/models';
import { IUser } from '../../src/modules/user/UserModel';
import { ITask } from '../../src/modules/task/TaskModel';
export const restartCounters = () => {
  global.__COUNTERS__ = Object.keys(global.__COUNTERS__).reduce((prev, curr) => ({ ...prev, [curr]: 0 }), {});
};

export const createUser = async (payload: Partial<IUser> = {}) => {
  const n = (global.__COUNTERS__.user += 1);

  return new User({
    name: `Normal user ${n}`,
    email: `user-${n}@example.com`,
    password: '123456',
    active: true,
    ...payload,
  }).save();
};

export const createTask = async (payload: Partial<ITask> = {}) => {
  const n = (global.__COUNTERS__.task += 1);

  return new Task({
    title: `Task ${n}`,
    description: `${n} my task ${n}`,
    ...payload,
  }).save();
};
