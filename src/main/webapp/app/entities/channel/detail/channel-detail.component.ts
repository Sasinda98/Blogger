import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChannel } from '../channel.model';

@Component({
  selector: 'jhi-channel-detail',
  templateUrl: './channel-detail.component.html',
})
export class ChannelDetailComponent implements OnInit {
  channel: IChannel | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ channel }) => {
      this.channel = channel;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
