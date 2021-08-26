import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IMUser, MUser } from '../m-user.model';
import { MUserService } from '../service/m-user.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUserStatistic } from 'app/entities/user-statistic/user-statistic.model';
import { UserStatisticService } from 'app/entities/user-statistic/service/user-statistic.service';

@Component({
  selector: 'jhi-m-user-update',
  templateUrl: './m-user-update.component.html',
})
export class MUserUpdateComponent implements OnInit {
  isSaving = false;

  statisticsCollection: IUserStatistic[] = [];

  editForm = this.fb.group({
    id: [],
    username: [],
    email: [],
    dob: [],
    about: [],
    profilePicture: [],
    profilePictureContentType: [],
    statistic: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected mUserService: MUserService,
    protected userStatisticService: UserStatisticService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mUser }) => {
      if (mUser.id === undefined) {
        const today = dayjs().startOf('day');
        mUser.dob = today;
      }

      this.updateForm(mUser);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('bloggerApp.error', { message: err.message })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mUser = this.createFromForm();
    if (mUser.id !== undefined) {
      this.subscribeToSaveResponse(this.mUserService.update(mUser));
    } else {
      this.subscribeToSaveResponse(this.mUserService.create(mUser));
    }
  }

  trackUserStatisticById(index: number, item: IUserStatistic): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMUser>>): void {
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

  protected updateForm(mUser: IMUser): void {
    this.editForm.patchValue({
      id: mUser.id,
      username: mUser.username,
      email: mUser.email,
      dob: mUser.dob ? mUser.dob.format(DATE_TIME_FORMAT) : null,
      about: mUser.about,
      profilePicture: mUser.profilePicture,
      profilePictureContentType: mUser.profilePictureContentType,
      statistic: mUser.statistic,
    });

    this.statisticsCollection = this.userStatisticService.addUserStatisticToCollectionIfMissing(this.statisticsCollection, mUser.statistic);
  }

  protected loadRelationshipsOptions(): void {
    this.userStatisticService
      .query({ filter: 'linkeduser-is-null' })
      .pipe(map((res: HttpResponse<IUserStatistic[]>) => res.body ?? []))
      .pipe(
        map((userStatistics: IUserStatistic[]) =>
          this.userStatisticService.addUserStatisticToCollectionIfMissing(userStatistics, this.editForm.get('statistic')!.value)
        )
      )
      .subscribe((userStatistics: IUserStatistic[]) => (this.statisticsCollection = userStatistics));
  }

  protected createFromForm(): IMUser {
    return {
      ...new MUser(),
      id: this.editForm.get(['id'])!.value,
      username: this.editForm.get(['username'])!.value,
      email: this.editForm.get(['email'])!.value,
      dob: this.editForm.get(['dob'])!.value ? dayjs(this.editForm.get(['dob'])!.value, DATE_TIME_FORMAT) : undefined,
      about: this.editForm.get(['about'])!.value,
      profilePictureContentType: this.editForm.get(['profilePictureContentType'])!.value,
      profilePicture: this.editForm.get(['profilePicture'])!.value,
      statistic: this.editForm.get(['statistic'])!.value,
    };
  }
}
