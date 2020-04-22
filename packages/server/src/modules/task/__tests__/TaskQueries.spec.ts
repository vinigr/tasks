import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';

import { schema } from '../../../schema';

import {
  clearDbAndRestartCounters,
  connectMongoose,
  createUser,
  createTask,
  disconnectMongoose,
  getContext,
} from '../../../../test/helpers';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

it('should query all tasks', async () => {
  const user = await createUser();
  await createTask({ author: user._id });
  await createTask({ author: user._id });

  const query = `
      {
        tasks {
          edges {
            node {
              id
              ... on Task {
                _id
                title
                description
              }
            }
          }
        }
      }
    `;

  const rootQuery = {};
  const context = await getContext({ user });
  const variables = {};

  const result = await graphql(schema, query, rootQuery, context, variables);
  const { data } = result;

  expect(result.errors).toBeUndefined();
  expect(data!.tasks.edges).toHaveLength(2);
});

it('should search tasks by title', async () => {
  const user = await createUser();
  const task = await createTask({ author: user._id });
  await createTask({ author: user._id });

  const query = `
      query Q($search: String){
        tasks(search: $search) {
          edges {
            node {
              id
              ... on Task {
                _id
                title
                description
              }
            }
          }
        }
      }
    `;

  const rootQuery = {};
  const context = await getContext();
  const variables = {
    search: task.title,
  };

  const result = await graphql(schema, query, rootQuery, context, variables);
  const { data } = result;

  expect(result.errors).toBeUndefined();
  expect(data!.tasks.edges).toHaveLength(1);
  expect(data!.tasks.edges[0].node._id).toBe(task._id.toString());
});

it('should query an task', async () => {
  const user = await createUser();
  const task = await createTask({ author: user._id });

  const query = `
      query Q($id: ID!){
        task(id: $id) {
          id
          _id
          title
          description
          author {
            name
          }
          createdAt
          updatedAt
        }
      }
    `;

  const rootQuery = {};
  const context = await getContext();
  const variables = {
    id: toGlobalId('Task', task._id),
  };

  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.data!.task.title).toBe(task.title);
});
