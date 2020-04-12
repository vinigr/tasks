/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/array-type */

import DataLoader from 'dataloader';
import { Types } from 'mongoose';
import { Context } from 'koa';

import { IUser } from './modules/user/UserModel';
import { ITask } from './modules/task/TaskModel';

export type DataLoaderKey = Types.ObjectId | string | undefined | null;

export interface GraphQLDataloaders {
  UserLoader: DataLoader<DataLoaderKey, IUser>;
  TaskLoader: DataLoader<DataLoaderKey, ITask>;
}

export interface GraphQLContext {
  dataloaders: GraphQLDataloaders;
  appplatform: string;
  koaContext: Context;
}
