import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMUser } from '../m-user.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-m-user-detail',
  templateUrl: './m-user-detail.component.html',
})
export class MUserDetailComponent implements OnInit {
  mUser: IMUser | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mUser }) => {
      this.mUser = mUser;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
