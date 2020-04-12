import Koa, { Request, Context } from 'koa';
import bodyParser from 'koa-bodyparser';
import convert from 'koa-convert';
import cors from 'koa-cors';

import koaPlayground from 'graphql-playground-middleware-koa';

import graphqlBatchHttpWrapper from 'koa-graphql-batch';

import Router from '@koa/router';
import logger from 'koa-logger';

import { GraphQLError } from 'graphql';
import graphqlHttp, { OptionsData } from 'koa-graphql';

import * as loaders from './loader';

import { getUser } from './auth';

import { getDataloaders } from './helper';
import { schema } from './schema';

const app = new Koa<any, Context>();

if (process.env.NODE_ENV === 'production') {
  app.proxy = true;
}

const router = new Router<any, Context>();

// if production than trick cookies library to think it is always on a secure request
if (process.env.NODE_ENV === 'production') {
  app.use((ctx, next) => {
    ctx.cookies.secure = true;
    return next();
  });
}

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('koa error:', err);
    ctx.status = err.status || 500;
    ctx.app.emit('error', err, ctx);
  }
});

app.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Error while answering request', { error: err });
});

if (process.env.NODE_ENV !== 'test') {
  app.use(logger());
}

// Middleware to get dataloaders
app.use((ctx, next) => {
  ctx.dataloaders = getDataloaders(loaders);
  return next();
});

const graphqlSettingsPerReq = async (req: Request, _, koaContext: unknown): Promise<OptionsData> => {
  const { user } = await getUser(req.header.authorization);

  const { dataloaders } = koaContext;

  return {
    graphiql: process.env.NODE_ENV !== 'production',
    schema,
    context: {
      user,
      req,
      dataloaders,
    },
    formatError: (error: GraphQLError) => {
      // eslint-disable-next-line no-console
      console.log(error.message);
      // eslint-disable-next-line no-console
      console.log(error.locations);
      // eslint-disable-next-line no-console
      console.log(error.stack);

      return {
        message: error.message,
        locations: error.locations,
        stack: error.stack,
      };
    },
  };
};

const graphqlServer = graphqlHttp(graphqlSettingsPerReq);

router.all('/graphql/batch', bodyParser(), graphqlBatchHttpWrapper(graphqlServer));
router.all('/graphql', graphqlServer);
router.all(
  '/graphiql',
  koaPlayground({
    endpoint: '/graphql',
    subscriptionEndpoint: '/subscriptions',
  }),
);

app.use(logger());
app.use(convert(cors({ maxAge: 86400, origin: '*' })));
app.use(router.routes()).use(router.allowedMethods());

export default app;
