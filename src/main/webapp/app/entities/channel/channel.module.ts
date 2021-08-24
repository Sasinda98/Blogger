import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChannelComponent } from './list/channel.component';
import { ChannelDetailComponent } from './detail/channel-detail.component';
import { ChannelUpdateComponent } from './update/channel-update.component';
import { ChannelDeleteDialogComponent } from './delete/channel-delete-dialog.component';
import { ChannelRoutingModule } from './route/channel-routing.module';

@NgModule({
  imports: [SharedModule, ChannelRoutingModule],
  declarations: [ChannelComponent, ChannelDetailComponent, ChannelUpdateComponent, ChannelDeleteDialogComponent],
  entryComponents: [ChannelDeleteDialogComponent],
})
export class ChannelModule {}
