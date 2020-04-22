import { graphql } from 'graphql';

import { schema } from '../../../../schema';
import {
  getContext,
  connectMongoose,
  clearDbAndRestartCounters,
  disconnectMongoose,
  createUser,
} from '../../../../../test/helpers';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

it('should not create task if user not authenticate', async () => {
  // language graphQL
  const query = `
    mutation M($title: String!, $description: String) {
      TaskAdd(input: {title: $title, description: $description}) {
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
    title: 'test',
    description: 'tests',
  };
  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.data!.TaskAdd.error).toBe('User not authenticated');
});

it('should create task', async () => {
  const user = await createUser();

  // language graphQL
  const query = `
    mutation M($title: String!, $description: String) {
      TaskAdd(input: {title: $title, description: $description}) {
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
    title: 'test',
  };
  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.data!.TaskAdd.task.node.title).toBe('test');
});
