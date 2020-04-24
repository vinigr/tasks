import {
  Environment,
  FetchFunction,
  Network,
  RecordSource,
  Store,
  Variables,
  SubscribeFunction,
  Observable,
} from 'relay-runtime';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import RelayQueryResponseCache from 'relay-runtime/lib/network/RelayQueryResponseCache';

import { GRAPHQL_URL, SUBSCRIPTION_URL } from '../common/config';

import { getAccessToken } from '../helpers/auth';

interface Sink<T = any> {
  next(value: T): void;
  error(error: Error, isUncaughtThrownError?: boolean): void;
  complete(): void;
  readonly closed: boolean;
}

const oneMinute = 60 * 1000;
const cache = new RelayQueryResponseCache({ size: 250, ttl: oneMinute });

const fetchQuery: FetchFunction = async (operation: any, variables: Variables, cacheConfig) => {
  const queryID = operation.text;
  const isMutation = operation.operationKind === 'mutation';
  const isQuery = operation.operationKind === 'query';
  const forceFetch = cacheConfig && cacheConfig.force;

  const fromCache = cache.get(queryID, variables);

  if (isQuery && fromCache !== null && !forceFetch) {
    return fromCache;
  }

  const token = getAccessToken();

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: token ? token : '',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  });

  const json = await response.json();

  if (isQuery && json) {
    cache.set(queryID, variables, json);
  }

  if (isMutation) {
    cache.clear();
  }

  return json;
};

const setupSubscription = (subscriptionClient: SubscriptionClient): SubscribeFunction => (request, variables) => {
  if (!request.text) throw new Error('Missing document.');
  const { text: query } = request;

  return Observable.create((sink) => {
    const c = subscriptionClient.request({ query, variables }).subscribe(sink as any);
    return c as any;
  });
};

const client = new SubscriptionClient(SUBSCRIPTION_URL, {
  reconnect: true,
  reconnectionAttempts: 100000,
});

const storeObject = new Store(new RecordSource());

const modernEnvironment: Environment = new Environment({
  network: Network.create(fetchQuery, setupSubscription(client)),
  store: storeObject,
});

export default modernEnvironment;
