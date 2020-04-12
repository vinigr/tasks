import { GraphQLObjectType } from 'graphql';

import UserMutations from '../modules/user/mutations';
import TaskMutations from '../modules/task/mutations';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    //User
    ...UserMutations,
    ...TaskMutations,
  }),
});
