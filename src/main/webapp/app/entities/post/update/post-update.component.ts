import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IPost, Post } from '../post.model';
import { PostService } from '../service/post.service';
import { IMUser } from 'app/entities/m-user/m-user.model';
import { MUserService } from 'app/entities/m-user/service/m-user.service';

@Component({
  selector: 'jhi-post-update',
  templateUrl: './post-update.component.html',
})
export class PostUpdateComponent implements OnInit {
  isSaving = false;

  mUsersSharedCollection: IMUser[] = [];

  editForm = this.fb.group({
    id: [],
    title: [],
    content: [],
    likes: [],
    createdAt: [],
    modifiedAt: [],
    isDeleted: [],
    viewScope: [],
    postCreator: [],
  });

  constructor(
    protected postService: PostService,
    protected mUserService: MUserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ post }) => {
      if (post.id === undefined) {
        const today = dayjs().startOf('day');
        post.createdAt = today;
        post.modifiedAt = today;
      }

      this.updateForm(post);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const post = this.createFromForm();
    if (post.id !== undefined) {
      this.subscribeToSaveResponse(this.postService.update(post));
    } else {
      this.subscribeToSaveResponse(this.postService.create(post));
    }
  }

  trackMUserById(index: number, item: IMUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPost>>): void {
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

  protected updateForm(post: IPost): void {
    this.editForm.patchValue({
      id: post.id,
      title: post.title,
      content: post.content,
      likes: post.likes,
      createdAt: post.createdAt ? post.createdAt.format(DATE_TIME_FORMAT) : null,
      modifiedAt: post.modifiedAt ? post.modifiedAt.format(DATE_TIME_FORMAT) : null,
      isDeleted: post.isDeleted,
      viewScope: post.viewScope,
      postCreator: post.postCreator,
    });

    this.mUsersSharedCollection = this.mUserService.addMUserToCollectionIfMissing(this.mUsersSharedCollection, post.postCreator);
  }

  protected loadRelationshipsOptions(): void {
    this.mUserService
      .query()
      .pipe(map((res: HttpResponse<IMUser[]>) => res.body ?? []))
      .pipe(map((mUsers: IMUser[]) => this.mUserService.addMUserToCollectionIfMissing(mUsers, this.editForm.get('postCreator')!.value)))
      .subscribe((mUsers: IMUser[]) => (this.mUsersSharedCollection = mUsers));
  }

  protected createFromForm(): IPost {
    return {
      ...new Post(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      content: this.editForm.get(['content'])!.value,
      likes: this.editForm.get(['likes'])!.value,
      createdAt: this.editForm.get(['createdAt'])!.value ? dayjs(this.editForm.get(['createdAt'])!.value, DATE_TIME_FORMAT) : undefined,
      modifiedAt: this.editForm.get(['modifiedAt'])!.value ? dayjs(this.editForm.get(['modifiedAt'])!.value, DATE_TIME_FORMAT) : undefined,
      isDeleted: this.editForm.get(['isDeleted'])!.value,
      viewScope: this.editForm.get(['viewScope'])!.value,
      postCreator: this.editForm.get(['postCreator'])!.value,
    };
  }
}
