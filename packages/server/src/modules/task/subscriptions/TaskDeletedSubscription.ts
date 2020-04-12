import { GraphQLObjectType, GraphQLID } from 'graphql';

import pubSub, { EVENTS } from '../../../pubSub';

const TaskDeletedPayloadType = new GraphQLObjectType({
  name: 'TaskDeletedPayload',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: ({ note }) => note._id,
    },
  }),
});

const taskDeletedSubscription = {
  type: TaskDeletedPayloadType,
  subscribe: () => pubSub.asyncIterator(EVENTS.TASK.DELETED),
};

export default taskDeletedSubscription;
