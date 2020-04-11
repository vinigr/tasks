import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';

import { schema } from '../../../schema';

import {
  clearDbAndRestartCounters,
  connectMongoose,
  createUser,
  disconnectMongoose,
  getContext,
  sanitizeTestObject,
} from '../../../../test/helpers';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

describe('UserType queries', () => {
  it('should query an user', async () => {
    const user = await createUser();

    // language=GraphQL
    const query = `
      query Q($id: ID!) {
        user: node(id: $id) {
          id
          ... on User {
            id
            name
            email
          }
        }
      }
    `;

    const variables = {
      id: toGlobalId('User', user._id),
    };
    const rootValue = {};
    const context = await getContext();
    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.errors).toBeUndefined();
    expect(sanitizeTestObject(result)).toMatchSnapshot();
  });
});
