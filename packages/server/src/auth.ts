import jwt from 'jsonwebtoken';

import { User } from './models';
import { JWT_SECRET } from './common/config';

export async function getUser(token: string) {
  if (!token) return { user: null };

  try {
    const decodedToken = jwt.verify(token.substring(4), JWT_SECRET);

    const user = await User.findOne({ _id: (decodedToken as { id: string }).id });

    return {
      user,
    };
  } catch (err) {
    return { user: null };
  }
}

type UserType = {
  _id: string;
};

export function generateToken(user: UserType) {
  return `JWT ${jwt.sign({ id: user._id }, JWT_SECRET)}`;
}

export function getUserSubscription(token: string) {
  if (!token) return { user: null };

  const decodedToken = jwt.verify(token.substring(4), JWT_SECRET);

  return {
    user: decodedToken,
  };
}
