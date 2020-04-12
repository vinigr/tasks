import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../connection/CustomConnectionType';
import { registerType, nodeInterface } from '../../interface/NodeInterface';

import UserType from '../user/UserType';
import { UserLoader } from '../../loader';

const TaskType = registerType(
  new GraphQLObjectType({
    name: 'Task',
    description: 'Task Data',
    fields: () => ({
      id: globalIdField('Task'),
      _id: {
        type: GraphQLString,
        resolve: (task) => task._id,
      },
      title: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (task) => task.title,
      },
      details: {
        type: GraphQLString,
        resolve: (task) => task.details,
      },
      author: {
        type: UserType,
        resolve: (obj, _, context) => UserLoader.load(context, obj.author),
      },
      createdAt: {
        type: GraphQLString,
        resolve: ({ createdAt }) => (createdAt ? createdAt.toISOString() : null),
      },
      updatedAt: {
        type: GraphQLString,
        resolve: ({ updatedAt }) => (updatedAt ? updatedAt.toISOString() : null),
      },
    }),
    interfaces: () => [nodeInterface],
  }),
);

export default TaskType;

export const TaskConnection = connectionDefinitions({
  name: 'Task',
  nodeType: TaskType,
});
