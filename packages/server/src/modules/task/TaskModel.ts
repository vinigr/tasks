import mongoose, { Document, Model } from 'mongoose';

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'task',
  },
);

export interface ITask extends Document {
  title: string;
  description: string | null;
  author: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskModel: Model<ITask> = mongoose.model('Task', schema);

export default TaskModel;
