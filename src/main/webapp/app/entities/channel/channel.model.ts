import * as dayjs from 'dayjs';
import { IPost } from 'app/entities/post/post.model';
import { IMUser } from 'app/entities/m-user/m-user.model';

export interface IChannel {
  id?: number;
  name?: string | null;
  createdAt?: dayjs.Dayjs | null;
  modifiedAt?: dayjs.Dayjs | null;
  lastPostAt?: dayjs.Dayjs | null;
  isDeleted?: boolean | null;
  posts?: IPost[] | null;
  channelCreator?: IMUser | null;
}

export class Channel implements IChannel {
  constructor(
    public id?: number,
    public name?: string | null,
    public createdAt?: dayjs.Dayjs | null,
    public modifiedAt?: dayjs.Dayjs | null,
    public lastPostAt?: dayjs.Dayjs | null,
    public isDeleted?: boolean | null,
    public posts?: IPost[] | null,
    public channelCreator?: IMUser | null
  ) {
    this.isDeleted = this.isDeleted ?? false;
  }
}

export function getChannelIdentifier(channel: IChannel): number | undefined {
  return channel.id;
}
