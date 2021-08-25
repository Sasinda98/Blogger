import * as dayjs from 'dayjs';
import { IComment } from 'app/entities/comment/comment.model';

export interface IPost {
  id?: number;
  title?: string | null;
  content?: string | null;
  likes?: number | null;
  createdAt?: dayjs.Dayjs | null;
  modifiedAt?: dayjs.Dayjs | null;
  isDeleted?: boolean | null;
  comments?: IComment[] | null;
}

export class Post implements IPost {
  constructor(
    public id?: number,
    public title?: string | null,
    public content?: string | null,
    public likes?: number | null,
    public createdAt?: dayjs.Dayjs | null,
    public modifiedAt?: dayjs.Dayjs | null,
    public isDeleted?: boolean | null,
    public comments?: IComment[] | null
  ) {
    this.isDeleted = this.isDeleted ?? false;
  }
}

export function getPostIdentifier(post: IPost): number | undefined {
  return post.id;
}
