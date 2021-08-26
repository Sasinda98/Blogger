import * as dayjs from 'dayjs';
import { IMUser } from 'app/entities/m-user/m-user.model';

export interface IUserStatistic {
  id?: number;
  lastActive?: dayjs.Dayjs | null;
  numberOfPosts?: number | null;
  numberOfComments?: number | null;
  linkedUser?: IMUser | null;
}

export class UserStatistic implements IUserStatistic {
  constructor(
    public id?: number,
    public lastActive?: dayjs.Dayjs | null,
    public numberOfPosts?: number | null,
    public numberOfComments?: number | null,
    public linkedUser?: IMUser | null
  ) {}
}

export function getUserStatisticIdentifier(userStatistic: IUserStatistic): number | undefined {
  return userStatistic.id;
}
