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

it('should not login if email is not exist in the database', async () => {
  // language graphQL
  const query = `
    mutation M(
      $email: String!
      $password: String!
    ) {
      UserLoginWithEmail(input: {
        email: $email
        password: $password
      }) {
        token
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext();
  const variables = {
    email: 'test@example.com',
    password: '123',
  };

  const result = await graphql(schema, query, rootQuery, context, variables);
  const { data } = result;

  expect(data.UserLoginWithEmail.token).toBeNull();
  expect(data.UserLoginWithEmail.error).toBe('Invalid credentials');
});

it('should not login with whong password', async () => {
  const user = await createUser();

  const query = `
    mutation M(
      $email: String!
      $password: String!
    ) {
      UserLoginWithEmail(input:{
        email: $email
        password: $password
      }) {
        token
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext();
  const variables = {
    email: user.email,
    password: 'awesome',
  };

  const result = await graphql(schema, query, rootQuery, context, variables);
  const { data } = result;

  expect(data.UserLoginWithEmail.token).toBeNull();
  expect(data.UserLoginWithEmail.error).toBe('Invalid credentials');
});

it('should generate token when email and password is correct', async () => {
  const user = await createUser();

  const query = `
    mutation M(
      $email: String!
      $password: String!
    ) {
      UserLoginWithEmail(input: {
        email: $email
        password: $password
      }) {
        token
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext();
  const variables = {
    email: user.email,
    password: '123456',
  };

  const result = await graphql(schema, query, rootQuery, context, variables);
  const { data } = result;

  expect(data.UserLoginWithEmail.token).not.toBeNull();
  expect(data.UserLoginWithEmail.error).toBeNull();
});
