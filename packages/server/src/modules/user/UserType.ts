import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../connection/CustomConnectionType';
import { registerType, nodeInterface } from '../../interface/NodeInterface';

const UserType = registerType(
  new GraphQLObjectType({
    name: 'User',
    description: 'User Data',
    fields: () => ({
      id: globalIdField('User'),
      _id: {
        type: GraphQLString,
        resolve: (user) => user._id.toString(),
      },
      name: {
        type: GraphQLString,
        resolve: (user) => user.name,
      },
      email: {
        type: GraphQLString,
        resolve: (user) => user.email,
      },
      active: {
        type: GraphQLBoolean,
        resolve: (user) => user.active,
      },
    }),
    interfaces: () => [nodeInterface],
  }),
);

export default UserType;

export const UserConnection = connectionDefinitions({
  name: 'User',
  nodeType: GraphQLNonNull(UserType),
});
