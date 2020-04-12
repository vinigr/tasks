import { PubSub } from 'graphql-subscriptions';

export const EVENTS = {
  TASK: {
    ADDED: 'TASK_ADDED',
    UPDATED: 'TASK_UPDATED',
    DELETED: 'TASK_DELETED',
  },
};

export default new PubSub();
