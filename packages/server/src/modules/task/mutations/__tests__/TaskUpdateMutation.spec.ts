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

it('should not edit task if user not authenticate', async () => {
  // language graphQL
  const query = `
    mutation M($id: ID!, $title: String!, $details: String) {
      TaskUpdate(input: {id: $id, title: $title, details: $details}) {
        task {
          node {
            title
          }
        }
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext();
  const variables = {
    id: '123',
    title: 'test',
    description: 'tests',
  };
  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.data.TaskUpdate.error).toBe('User not authenticated');
});

it('should not edit task if it not found', async () => {
  const user = await createUser();
  await createTask({ author: user._id });

  // language graphQL
  const query = `
    mutation M($id: ID!, $title: String!, $details: String) {
      TaskUpdate(input: {id: $id, title: $title, details: $details}) {
        task {
          node {
            title
          }
        }
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const variables = {
    id: '5e936b0c4325ac8ee65c6818',
    title: 'test',
    description: 'tests',
  };
  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.data.TaskUpdate.error).toBe('Task not found');
});

it('should not edit task if user not author', async () => {
  const user = await createUser();
  const user2 = await createUser();
  const { id } = await createTask({ author: user2._id });

  // language graphQL
  const query = `
    mutation M($id: ID!, $title: String!, $details: String) {
      TaskUpdate(input: {id: $id, title: $title, details: $details}) {
        task {
          node {
            title
          }
        }
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const variables = {
    id: id,
    title: 'test',
    description: 'tests',
  };
  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.data.TaskUpdate.error).toBe('User not authorized');
});

it('should edit task', async () => {
  const user = await createUser();
  const { id } = await createTask({ author: user._id });

  // language graphQL
  const query = `
    mutation M($id: ID!, $title: String!, $details: String) {
      TaskUpdate(input: {id: $id, title: $title, details: $details}) {
        task {
          node {
            title
          }
        }
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const variables = {
    id: id,
    title: 'test update',
    description: 'tests',
  };
  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.data.TaskUpdate.task.node.title).toBe('test update');
});
