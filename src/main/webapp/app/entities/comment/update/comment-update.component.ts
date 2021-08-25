import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IComment, Comment } from '../comment.model';
import { CommentService } from '../service/comment.service';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

@Component({
  selector: 'jhi-comment-update',
  templateUrl: './comment-update.component.html',
})
export class CommentUpdateComponent implements OnInit {
  isSaving = false;

  postsSharedCollection: IPost[] = [];

  editForm = this.fb.group({
    id: [],
    comment: [],
    createdAt: [],
    modifiedAt: [],
    isDeleted: [],
    linkedPost: [],
  });

  constructor(
    protected commentService: CommentService,
    protected postService: PostService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comment }) => {
      if (comment.id === undefined) {
        const today = dayjs().startOf('day');
        comment.createdAt = today;
        comment.modifiedAt = today;
      }

      this.updateForm(comment);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const comment = this.createFromForm();
    if (comment.id !== undefined) {
      this.subscribeToSaveResponse(this.commentService.update(comment));
    } else {
      this.subscribeToSaveResponse(this.commentService.create(comment));
    }
  }

  trackPostById(index: number, item: IPost): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IComment>>): void {
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

  protected updateForm(comment: IComment): void {
    this.editForm.patchValue({
      id: comment.id,
      comment: comment.comment,
      createdAt: comment.createdAt ? comment.createdAt.format(DATE_TIME_FORMAT) : null,
      modifiedAt: comment.modifiedAt ? comment.modifiedAt.format(DATE_TIME_FORMAT) : null,
      isDeleted: comment.isDeleted,
      linkedPost: comment.linkedPost,
    });

    this.postsSharedCollection = this.postService.addPostToCollectionIfMissing(this.postsSharedCollection, comment.linkedPost);
  }

  protected loadRelationshipsOptions(): void {
    this.postService
      .query()
      .pipe(map((res: HttpResponse<IPost[]>) => res.body ?? []))
      .pipe(map((posts: IPost[]) => this.postService.addPostToCollectionIfMissing(posts, this.editForm.get('linkedPost')!.value)))
      .subscribe((posts: IPost[]) => (this.postsSharedCollection = posts));
  }

  protected createFromForm(): IComment {
    return {
      ...new Comment(),
      id: this.editForm.get(['id'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      createdAt: this.editForm.get(['createdAt'])!.value ? dayjs(this.editForm.get(['createdAt'])!.value, DATE_TIME_FORMAT) : undefined,
      modifiedAt: this.editForm.get(['modifiedAt'])!.value ? dayjs(this.editForm.get(['modifiedAt'])!.value, DATE_TIME_FORMAT) : undefined,
      isDeleted: this.editForm.get(['isDeleted'])!.value,
      linkedPost: this.editForm.get(['linkedPost'])!.value,
    };
  }
}
