import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { fromGlobalId, connectionArgs } from 'graphql-relay';

import UserType from '../modules/user/UserType';
import TaskType, { TaskConnection } from '../modules/task/TaskType';

import { nodeField } from '../interface/NodeInterface';
import { UserLoader, TaskLoader } from '../loader';

export default new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    node: nodeField,
    me: {
      type: UserType,
      resolve: (_, __, context) => (context.user ? UserLoader.load(context, context.user._id) : null),
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (_, args, context) => {
        const { id } = fromGlobalId(args.id);
        return UserLoader.load(context, id);
      },
    },
    task: {
      type: TaskType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (_, args, context) => {
        const { id } = fromGlobalId(args.id);
        return TaskLoader.load(context, id);
      },
    },
    tasks: {
      type: TaskConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: (_, args, context) => TaskLoader.loadTasks(context, args),
    },
  }),
});
