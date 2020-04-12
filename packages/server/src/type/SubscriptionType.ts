import { GraphQLObjectType } from 'graphql';

import TaskSubscriptions from '../modules/task/subscriptions';

export default new GraphQLObjectType({
  name: 'Subscription',
  fields: () => ({
    ...TaskSubscriptions,
  }),
});
