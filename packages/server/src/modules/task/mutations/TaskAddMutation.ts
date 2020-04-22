import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import pubSub, { EVENTS } from '../../../pubSub';

import { TaskConnection } from '../TaskType';
import * as TaskLoader from '../TaskLoader';

import { GraphQLContext } from '../../../TypeDefinition';
import TaskModel from '../TaskModel';

interface TaskAddArgs {
  title: string;
  description: string;
}

const mutation = mutationWithClientMutationId({
  name: 'TaskAdd',
  inputFields: {
    title: {
      type: GraphQLNonNull(GraphQLString),
    },
    description: {
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async ({ title, description }: TaskAddArgs, { user }: GraphQLContext) => {
    if (!user) {
      return {
        error: 'User not authenticated',
      };
    }

    const task = new TaskModel({
      title,
      description,
      author: user._id,
    });

    await task.save();

    pubSub.publish(EVENTS.TASK.ADDED, { TaskAdded: { task } });

    return {
      id: task._id,
    };
  },
  outputFields: {
    task: {
      type: TaskConnection.edgeType,
      resolve: async ({ id }, _, context) => {
        const newTask = await TaskLoader.load(context, id);

        // Returns null if no task was loaded
        if (!newTask) {
          return null;
        }

        return {
          cursor: toGlobalId('Task', newTask._id.toString()),
          node: newTask,
        };
      },
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
