import { graphql } from 'babel-plugin-relay/macro';
import { requestSubscription } from 'react-relay';

import Environment from '../../../relay/Environment';
import { GraphQLSubscriptionConfig, ConnectionHandler } from 'relay-runtime';
import { TaskAddedSubscriptionResponse } from './__generated__/TaskAddedSubscription.graphql';

const TaskAddedSubscription = graphql`
  subscription TaskAddedSubscription {
    TaskAdded {
      taskEdge {
        node {
          id
          title
          description
          author {
            name
          }
          updatedAt
        }
      }
    }
  }
`;

export default () => {
  const subscriptionConfig: GraphQLSubscriptionConfig<TaskAddedSubscriptionResponse> = {
    subscription: TaskAddedSubscription,
    variables: {},
    onError: (error) => console.log(error),
    updater: (store) => {
      const payload = store.getRootField('TaskAdded');
      const edge = payload!.getLinkedRecord('taskEdge');
      const task = edge!.getLinkedRecord('node');

      const root = store.getRoot();

      if (!root) {
        return;
      }

      const tasksConnection = ConnectionHandler.getConnection(root, 'TaskList_tasks');

      const tasksEdge = ConnectionHandler.createEdge(store, tasksConnection!, task!, 'TasksEdge');

      if (tasksConnection) {
        ConnectionHandler.insertEdgeBefore(tasksConnection!, tasksEdge);
      }
    },
  };

  return requestSubscription(Environment, subscriptionConfig);
};
