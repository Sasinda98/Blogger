import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserStatistic } from '../user-statistic.model';
import { UserStatisticService } from '../service/user-statistic.service';

@Component({
  templateUrl: './user-statistic-delete-dialog.component.html',
})
export class UserStatisticDeleteDialogComponent {
  userStatistic?: IUserStatistic;

  constructor(protected userStatisticService: UserStatisticService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userStatisticService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
