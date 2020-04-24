export const GRAPHQL_URL = process.env.GRAPHQL_URL || 'http://localhost:5000/graphql';
export const SUBSCRIPTION_URL = process.env.GRAPHQL_URL
  ? `ws://${process.env.GRAPHQL_URL}/subscriptions`
  : 'ws://localhost:5000/subscriptions';
