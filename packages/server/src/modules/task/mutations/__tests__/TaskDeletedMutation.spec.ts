import { graphql } from 'graphql';

import { schema } from '../../../../schema';
import {
  getContext,
  connectMongoose,
  clearDbAndRestartCounters,
  disconnectMongoose,
  createUser,
  createTask,
} from '../../../../../test/helpers';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

it('should not delete task if user not authenticate', async () => {
  // language graphQL
  const query = `
    mutation M($id: ID!) {
      TaskDelete(input: {id: $id}) {
        id
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext();
  const variables = {
    id: '123',
  };
  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.data.TaskDelete.error).toBe('User not authenticated');
});

it('should not delete task if it not found', async () => {
  const user = await createUser();
  await createTask({ author: user._id });

  // language graphQL
  const query = `
    mutation M($id: ID!) {
      TaskDelete(input: {id: $id}) {
        id
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const variables = {
    id: '5e936b0c4325ac8ee65c6818',
  };
  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.data.TaskDelete.error).toBe('Task not found');
});

it('should not delete task if user not author', async () => {
  const user = await createUser();
  const user2 = await createUser();
  const { id } = await createTask({ author: user2._id });

  // language graphQL
  const query = `
    mutation M($id: ID!) {
      TaskDelete(input: {id: $id}) {
        id
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const variables = {
    id,
  };
  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.data.TaskDelete.error).toBe('User not authorized');
});

it('should delete task', async () => {
  const user = await createUser();
  const { id } = await createTask({ author: user._id });

  // language graphQL
  const query = `
    mutation M($id: ID!) {
      TaskDelete(input: {id: $id}) {
        id
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const variables = {
    id,
  };
  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.data.TaskDelete.id).toBe(id);
});
