import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IChannel } from '../channel.model';
import { ChannelService } from '../service/channel.service';

@Component({
  templateUrl: './channel-delete-dialog.component.html',
})
export class ChannelDeleteDialogComponent {
  channel?: IChannel;

  constructor(protected channelService: ChannelService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.channelService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
