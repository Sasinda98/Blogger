import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMUser } from '../m-user.model';
import { MUserService } from '../service/m-user.service';

@Component({
  templateUrl: './m-user-delete-dialog.component.html',
})
export class MUserDeleteDialogComponent {
  mUser?: IMUser;

  constructor(protected mUserService: MUserService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.mUserService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
