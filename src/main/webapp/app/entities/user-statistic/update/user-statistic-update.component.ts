import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IUserStatistic, UserStatistic } from '../user-statistic.model';
import { UserStatisticService } from '../service/user-statistic.service';

@Component({
  selector: 'jhi-user-statistic-update',
  templateUrl: './user-statistic-update.component.html',
})
export class UserStatisticUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    lastActive: [],
    numberOfPosts: [],
    numberOfComments: [],
  });

  constructor(protected userStatisticService: UserStatisticService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userStatistic }) => {
      if (userStatistic.id === undefined) {
        const today = dayjs().startOf('day');
        userStatistic.lastActive = today;
      }

      this.updateForm(userStatistic);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userStatistic = this.createFromForm();
    if (userStatistic.id !== undefined) {
      this.subscribeToSaveResponse(this.userStatisticService.update(userStatistic));
    } else {
      this.subscribeToSaveResponse(this.userStatisticService.create(userStatistic));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserStatistic>>): void {
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

  protected updateForm(userStatistic: IUserStatistic): void {
    this.editForm.patchValue({
      id: userStatistic.id,
      lastActive: userStatistic.lastActive ? userStatistic.lastActive.format(DATE_TIME_FORMAT) : null,
      numberOfPosts: userStatistic.numberOfPosts,
      numberOfComments: userStatistic.numberOfComments,
    });
  }

  protected createFromForm(): IUserStatistic {
    return {
      ...new UserStatistic(),
      id: this.editForm.get(['id'])!.value,
      lastActive: this.editForm.get(['lastActive'])!.value ? dayjs(this.editForm.get(['lastActive'])!.value, DATE_TIME_FORMAT) : undefined,
      numberOfPosts: this.editForm.get(['numberOfPosts'])!.value,
      numberOfComments: this.editForm.get(['numberOfComments'])!.value,
    };
  }
}
