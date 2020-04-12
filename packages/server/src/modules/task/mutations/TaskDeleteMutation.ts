import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { Types } from 'mongoose';

import pubSub, { EVENTS } from '../../../pubSub';

import { GraphQLContext } from '../../../TypeDefinition';
import TaskModel from '../TaskModel';

interface TaskUpdateArgs {
  id: Types.ObjectId;
}

const mutation = mutationWithClientMutationId({
  name: 'TaskDelete',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  mutateAndGetPayload: async ({ id }: TaskUpdateArgs, { user }: GraphQLContext) => {
    if (!user) {
      return {
        error: 'User not authenticated',
      };
    }

    const task = await TaskModel.findById(id);

    if (!task) {
      return {
        error: 'Task not found',
      };
    }

    if (task.author.toString() !== user._id.toString()) {
      return {
        error: 'User not authorized',
      };
    }

    await task.remove();

    pubSub.publish(EVENTS.TASK.DELETED, { TaskDeleted: { task } });

    return {
      id,
    };
  },
  outputFields: {
    id: {
      type: GraphQLID,
      resolve: ({ id }) => id,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});

export default {
  ...mutation,
};
