import * as dayjs from 'dayjs';
import { IUserStatistic } from 'app/entities/user-statistic/user-statistic.model';
import { IChannel } from 'app/entities/channel/channel.model';
import { IPost } from 'app/entities/post/post.model';
import { IComment } from 'app/entities/comment/comment.model';

export interface IMUser {
  id?: number;
  username?: string | null;
  email?: string | null;
  dob?: dayjs.Dayjs | null;
  about?: string | null;
  userStatistic?: IUserStatistic | null;
  channels?: IChannel[] | null;
  posts?: IPost[] | null;
  comments?: IComment[] | null;
}

export class MUser implements IMUser {
  constructor(
    public id?: number,
    public username?: string | null,
    public email?: string | null,
    public dob?: dayjs.Dayjs | null,
    public about?: string | null,
    public userStatistic?: IUserStatistic | null,
    public channels?: IChannel[] | null,
    public posts?: IPost[] | null,
    public comments?: IComment[] | null
  ) {}
}

export function getMUserIdentifier(mUser: IMUser): number | undefined {
  return mUser.id;
}
