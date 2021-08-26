import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserStatistic } from '../user-statistic.model';

@Component({
  selector: 'jhi-user-statistic-detail',
  templateUrl: './user-statistic-detail.component.html',
})
export class UserStatisticDetailComponent implements OnInit {
  userStatistic: IUserStatistic | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userStatistic }) => {
      this.userStatistic = userStatistic;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
