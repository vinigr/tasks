import { graphql } from 'graphql';

import UserModel from '../../UserModel';
import { schema } from '../../../../schema';
import {
  clearDbAndRestartCounters,
  connectMongoose,
  createUser,
  disconnectMongoose,
  getContext,
} from '../../../../../test/helpers';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

it('should not register with an existing email', async () => {
  const user = await createUser();

  // language graphQL
  const query = `
    mutation M(
      $name: String!
      $email: String!
      $password: String!
    ) {
      UserRegisterWithEmail(input: {
        name: $name
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
    name: 'Test',
    email: user.email,
    password: 'test',
  };

  const result = await graphql(schema, query, rootQuery, context, variables);
  const { data } = result;

  expect(data.UserRegisterWithEmail.token).toBe(null);
  expect(data.UserRegisterWithEmail.error).toBe('Email already in use');
});

it('should create a new user when parameters are valid', async () => {
  const email = 'test@example.com';

  // language graphQL
  const query = `
    mutation M(
      $name: String!
      $email: String!
      $password: String!
    ) {
      UserRegisterWithEmail(input: {
        name: $name
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
    name: 'test',
    email,
    password: 'test123',
  };
  const result = await graphql(schema, query, rootQuery, context, variables);
  const { data } = result;

  expect(data.UserRegisterWithEmail.token).not.toBeNull();
  expect(data.UserRegisterWithEmail.error).toBeNull();

  const user = await UserModel.findOne({ email });

  expect(user).not.toBeNull();
});
