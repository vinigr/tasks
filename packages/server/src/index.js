import 'core-js';

import { createServer } from 'http';

import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';

import { GRAPHQL_PORT } from './common/config';
import connectDatabase from './common/database';

import app from './app';

(async () => {
  try {
    // eslint-disable-next-line no-console
    console.log('connecting to database...');
    await connectDatabase();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Could not connect to database', { error });
    throw error;
  }

  const server = createServer(app.callback());

  server.listen(GRAPHQL_PORT, () => {
    // eslint-disable-next-line no-console
    console.info(`Server started on port: ${GRAPHQL_PORT}`);
  });

  SubscriptionServer.create(
    {
      // eslint-disable-next-line no-console
      onConnect: async (connectionParams) => {
        const { user } = getUserSubscription(connectionParams.Authorization);

        return { user };
      },
      // eslint-disable-next-line no-console
      onDisconnect: () => console.info('Client subscription disconnected'),
      execute,
      subscribe,
      schema,
    },
    {
      server,
      path: '/subscriptions',
    },
  );
})();

let currentApp = app;

if (module.hot) {
  module.hot.accept('./index.js', () => {
    app.removeListener('request', currentApp);
    app.on('request', app);
    currentApp = app;
  });
}
