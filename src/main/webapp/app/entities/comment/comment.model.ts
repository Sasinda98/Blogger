import * as dayjs from 'dayjs';
import { IPost } from 'app/entities/post/post.model';
import { IMUser } from 'app/entities/m-user/m-user.model';

export interface IComment {
  id?: number;
  comment?: string | null;
  createdAt?: dayjs.Dayjs | null;
  modifiedAt?: dayjs.Dayjs | null;
  isDeleted?: boolean | null;
  post?: IPost | null;
  muser?: IMUser | null;
}

export class Comment implements IComment {
  constructor(
    public id?: number,
    public comment?: string | null,
    public createdAt?: dayjs.Dayjs | null,
    public modifiedAt?: dayjs.Dayjs | null,
    public isDeleted?: boolean | null,
    public post?: IPost | null,
    public muser?: IMUser | null
  ) {
    this.isDeleted = this.isDeleted ?? false;
  }
}

export function getCommentIdentifier(comment: IComment): number | undefined {
  return comment.id;
}
