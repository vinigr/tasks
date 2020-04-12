import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import { Types } from 'mongoose';

import pubSub, { EVENTS } from '../../../pubSub';

import { TaskConnection } from '../TaskType';
import * as TaskLoader from '../TaskLoader';

import { GraphQLContext } from '../../../TypeDefinition';
import TaskModel from '../TaskModel';

interface TaskUpdateArgs {
  id: Types.ObjectId;
  title: string;
  details: string;
}

const mutation = mutationWithClientMutationId({
  name: 'TaskUpdate',
  inputFields: {
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
    title: {
      type: GraphQLNonNull(GraphQLString),
    },
    details: {
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async ({ id, title, details }: TaskUpdateArgs, { user }: GraphQLContext) => {
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

    task.title = title;
    task.details = details;

    task.save();

    pubSub.publish(EVENTS.TASK.UPDATED, { TaskUpdated: { task } });

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
