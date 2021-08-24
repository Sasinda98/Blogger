import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMUser } from '../m-user.model';

@Component({
  selector: 'jhi-m-user-detail',
  templateUrl: './m-user-detail.component.html',
})
export class MUserDetailComponent implements OnInit {
  mUser: IMUser | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mUser }) => {
      this.mUser = mUser;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
