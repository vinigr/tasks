import DataLoader from 'dataloader';
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';
import mongoose, { Types } from 'mongoose';
import { ConnectionArguments } from 'graphql-relay';

import { GraphQLContext } from '../../TypeDefinition';

import TaskModel, { ITask } from './TaskModel';

declare type ObjectId = mongoose.Schema.Types.ObjectId;

export default class Task {
  id: string;

  _id: Types.ObjectId;

  title: string;

  details: string | null | undefined;

  author: mongoose.Schema.Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;

  constructor(data: ITask) {
    this.id = data._id;
    this._id = data._id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.title = data.title;
    this.details = data.details;
    this.author = data.author;
  }
}

export const getLoader = () => new DataLoader((ids: ReadonlyArray<string>) => mongooseLoader(TaskModel, ids));

const viewerCanSee = () => true;

export const load = async (
  context: GraphQLContext,
  id: string | Record<string, any> | ObjectId,
): Promise<Task | null> => {
  if (!id && typeof id !== 'string') {
    return null;
  }

  let data;

  try {
    data = await context.dataloaders.TaskLoader.load(id as string);
  } catch (error) {
    return null;
  }

  return viewerCanSee() ? new Task(data) : null;
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId) =>
  dataloaders.TaskLoader.clear(id.toString());

export const primeCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId, data: ITask) =>
  dataloaders.TaskLoader.prime(id.toString(), data);

export const clearAndPrimeCache = (context: GraphQLContext, id: Types.ObjectId, data: ITask) =>
  clearCache(context, id) && primeCache(context, id, data);

type TaskArgs = ConnectionArguments & {
  search?: string;
};

export const loadTasks = async (context: GraphQLContext, args: TaskArgs) => {
  const where = args.search ? { title: { $regex: new RegExp(`^${args.search}`, 'ig') } } : {};
  const users = TaskModel.find(where, { _id: 1 }).sort({ createdAt: -1 });

  return connectionFromMongoCursor({
    cursor: users,
    context,
    args,
    loader: load,
  });
};
