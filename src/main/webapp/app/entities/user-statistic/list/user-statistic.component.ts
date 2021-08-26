import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserStatistic } from '../user-statistic.model';
import { UserStatisticService } from '../service/user-statistic.service';
import { UserStatisticDeleteDialogComponent } from '../delete/user-statistic-delete-dialog.component';

@Component({
  selector: 'jhi-user-statistic',
  templateUrl: './user-statistic.component.html',
})
export class UserStatisticComponent implements OnInit {
  userStatistics?: IUserStatistic[];
  isLoading = false;

  constructor(protected userStatisticService: UserStatisticService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.userStatisticService.query().subscribe(
      (res: HttpResponse<IUserStatistic[]>) => {
        this.isLoading = false;
        this.userStatistics = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IUserStatistic): number {
    return item.id!;
  }

  delete(userStatistic: IUserStatistic): void {
    const modalRef = this.modalService.open(UserStatisticDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.userStatistic = userStatistic;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
