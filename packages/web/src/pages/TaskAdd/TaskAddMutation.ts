import { graphql } from 'babel-plugin-relay/macro';

import { commitMutation } from 'react-relay';

import Environment from '../../relay/Environment';

import { TaskAddInput, TaskAddMutationResponse, TaskAddMutation } from './__generated__/TaskAddMutation.graphql';

const mutation = graphql`
  mutation TaskAddMutation($input: TaskAddInput!) {
    TaskAdd(input: $input) {
      task {
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
      error
    }
  }
`;

function commit(
  input: TaskAddInput,
  onCompleted: (response: TaskAddMutationResponse) => void,
  onError: (error: Error) => void,
) {
  return commitMutation<TaskAddMutation>(Environment, {
    mutation,
    variables: { input },
    onCompleted,
    onError,
  });
}

export default { commit };
