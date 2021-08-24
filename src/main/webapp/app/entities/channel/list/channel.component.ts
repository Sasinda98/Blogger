import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IChannel } from '../channel.model';
import { ChannelService } from '../service/channel.service';
import { ChannelDeleteDialogComponent } from '../delete/channel-delete-dialog.component';

@Component({
  selector: 'jhi-channel',
  templateUrl: './channel.component.html',
})
export class ChannelComponent implements OnInit {
  channels?: IChannel[];
  isLoading = false;

  constructor(protected channelService: ChannelService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.channelService.query().subscribe(
      (res: HttpResponse<IChannel[]>) => {
        this.isLoading = false;
        this.channels = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IChannel): number {
    return item.id!;
  }

  delete(channel: IChannel): void {
    const modalRef = this.modalService.open(ChannelDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.channel = channel;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
