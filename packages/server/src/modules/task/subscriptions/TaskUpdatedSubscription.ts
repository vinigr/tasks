import { GraphQLObjectType } from 'graphql';
import { offsetToCursor } from 'graphql-relay';

import { TaskConnection } from '../TaskType';
import pubSub, { EVENTS } from '../../../pubSub';

const TaskUpdatedPayloadType = new GraphQLObjectType({
  name: 'TaskUpdatedPayload',
  fields: () => ({
    taskEdge: {
      type: TaskConnection.edgeType,
      resolve: ({ task }) => ({
        cursor: offsetToCursor(task.id),
        node: task,
      }),
    },
  }),
});

const taskUpdatedSubscription = {
  type: TaskUpdatedPayloadType,
  subscribe: () => pubSub.asyncIterator(EVENTS.TASK.UPDATED),
};

export default taskUpdatedSubscription;
