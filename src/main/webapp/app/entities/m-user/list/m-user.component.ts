import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMUser } from '../m-user.model';
import { MUserService } from '../service/m-user.service';
import { MUserDeleteDialogComponent } from '../delete/m-user-delete-dialog.component';

@Component({
  selector: 'jhi-m-user',
  templateUrl: './m-user.component.html',
})
export class MUserComponent implements OnInit {
  mUsers?: IMUser[];
  isLoading = false;

  constructor(protected mUserService: MUserService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.mUserService.query().subscribe(
      (res: HttpResponse<IMUser[]>) => {
        this.isLoading = false;
        this.mUsers = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMUser): number {
    return item.id!;
  }

  delete(mUser: IMUser): void {
    const modalRef = this.modalService.open(MUserDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.mUser = mUser;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
