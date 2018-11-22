import memoizeOne from 'memoize-one';
import {
  Promisable,
  User,
  UserOption,
  UserValue,
  InputActionTypes,
} from '../types';
import { ReactElement, ReactChild } from 'react';

export const userToOption = (user: User) => ({
  label: user.name || user.nickname || '',
  value: user.id,
  user,
});

export const extractUserValue = (value?: UserOption | UserOption[]) => {
  if (!value) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.map(({ user }) => user);
  }
  return value.user;
};

export const isIterable = (
  a: Promisable<User | User[]> | Iterable<Promisable<User | User[]>>,
): a is Iterable<Promisable<User | User[]>> =>
  typeof a[Symbol.iterator] === 'function';

export const hasSingleValue = (
  u: UserOption | UserOption[] | undefined,
): u is UserOption => !!u && !Array.isArray(u);

export const getUsers = (usersFromState: User[], usersFromProps?: User[]) => {
  if (usersFromState.length > 0) {
    return usersFromState;
  }
  return usersFromProps;
};

export const getOptions = memoizeOne(
  (usersFromState: User[], usersFromProps?: User[]) => {
    const users = getUsers(usersFromState, usersFromProps);
    if (users) {
      return users.map(userToOption);
    }
    return undefined;
  },
);

export const usersToOptions = memoizeOne((defaultValue: UserValue) => {
  if (!defaultValue) {
    return undefined;
  }
  if (Array.isArray(defaultValue)) {
    return defaultValue.map(userToOption);
  }
  return userToOption(defaultValue);
});

export const getAvatarSize = (
  appearance: string,
): 'small' | 'xsmall' | 'medium' =>
  appearance === 'normal'
    ? 'small'
    : appearance === 'big'
    ? 'medium'
    : 'xsmall';

export const isChildInput = (child: ReactChild): child is ReactElement<any> =>
  child &&
  typeof child === 'object' &&
  child.props &&
  child.props.type === 'text';
