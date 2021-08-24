import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IChannel, Channel } from '../channel.model';
import { ChannelService } from '../service/channel.service';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';
import { IMUser } from 'app/entities/m-user/m-user.model';
import { MUserService } from 'app/entities/m-user/service/m-user.service';

@Component({
  selector: 'jhi-channel-update',
  templateUrl: './channel-update.component.html',
})
export class ChannelUpdateComponent implements OnInit {
  isSaving = false;

  postsSharedCollection: IPost[] = [];
  mUsersSharedCollection: IMUser[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    createdAt: [],
    modifiedAt: [],
    lastPostAt: [],
    isDeleted: [],
    posts: [],
    channelCreator: [],
  });

  constructor(
    protected channelService: ChannelService,
    protected postService: PostService,
    protected mUserService: MUserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ channel }) => {
      if (channel.id === undefined) {
        const today = dayjs().startOf('day');
        channel.createdAt = today;
        channel.modifiedAt = today;
        channel.lastPostAt = today;
      }

      this.updateForm(channel);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const channel = this.createFromForm();
    if (channel.id !== undefined) {
      this.subscribeToSaveResponse(this.channelService.update(channel));
    } else {
      this.subscribeToSaveResponse(this.channelService.create(channel));
    }
  }

  trackPostById(index: number, item: IPost): number {
    return item.id!;
  }

  trackMUserById(index: number, item: IMUser): number {
    return item.id!;
  }

  getSelectedPost(option: IPost, selectedVals?: IPost[]): IPost {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChannel>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(channel: IChannel): void {
    this.editForm.patchValue({
      id: channel.id,
      name: channel.name,
      createdAt: channel.createdAt ? channel.createdAt.format(DATE_TIME_FORMAT) : null,
      modifiedAt: channel.modifiedAt ? channel.modifiedAt.format(DATE_TIME_FORMAT) : null,
      lastPostAt: channel.lastPostAt ? channel.lastPostAt.format(DATE_TIME_FORMAT) : null,
      isDeleted: channel.isDeleted,
      posts: channel.posts,
      channelCreator: channel.channelCreator,
    });

    this.postsSharedCollection = this.postService.addPostToCollectionIfMissing(this.postsSharedCollection, ...(channel.posts ?? []));
    this.mUsersSharedCollection = this.mUserService.addMUserToCollectionIfMissing(this.mUsersSharedCollection, channel.channelCreator);
  }

  protected loadRelationshipsOptions(): void {
    this.postService
      .query()
      .pipe(map((res: HttpResponse<IPost[]>) => res.body ?? []))
      .pipe(map((posts: IPost[]) => this.postService.addPostToCollectionIfMissing(posts, ...(this.editForm.get('posts')!.value ?? []))))
      .subscribe((posts: IPost[]) => (this.postsSharedCollection = posts));

    this.mUserService
      .query()
      .pipe(map((res: HttpResponse<IMUser[]>) => res.body ?? []))
      .pipe(map((mUsers: IMUser[]) => this.mUserService.addMUserToCollectionIfMissing(mUsers, this.editForm.get('channelCreator')!.value)))
      .subscribe((mUsers: IMUser[]) => (this.mUsersSharedCollection = mUsers));
  }

  protected createFromForm(): IChannel {
    return {
      ...new Channel(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      createdAt: this.editForm.get(['createdAt'])!.value ? dayjs(this.editForm.get(['createdAt'])!.value, DATE_TIME_FORMAT) : undefined,
      modifiedAt: this.editForm.get(['modifiedAt'])!.value ? dayjs(this.editForm.get(['modifiedAt'])!.value, DATE_TIME_FORMAT) : undefined,
      lastPostAt: this.editForm.get(['lastPostAt'])!.value ? dayjs(this.editForm.get(['lastPostAt'])!.value, DATE_TIME_FORMAT) : undefined,
      isDeleted: this.editForm.get(['isDeleted'])!.value,
      posts: this.editForm.get(['posts'])!.value,
      channelCreator: this.editForm.get(['channelCreator'])!.value,
    };
  }
}
