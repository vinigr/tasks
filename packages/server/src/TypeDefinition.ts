import DataLoader from 'dataloader';

import { Context } from 'koa';

import { Types } from 'mongoose';

import { IUser } from './modules/user/UserModel';
import { ITask } from './modules/task/TaskModel';

export type DataLoaderKey = Types.ObjectId | string | undefined | null;

export type Dataloaders = {
  UserLoader: DataLoader<DataLoaderKey, IUser>;
  TaskLoader: DataLoader<DataLoaderKey, ITask>;
};

export type GraphQLContext = {
  user?: IUser;
  dataloaders: Dataloaders;
  appplatform: string;
  koaContext: Context;
};
