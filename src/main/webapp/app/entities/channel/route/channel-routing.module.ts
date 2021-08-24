import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChannelComponent } from '../list/channel.component';
import { ChannelDetailComponent } from '../detail/channel-detail.component';
import { ChannelUpdateComponent } from '../update/channel-update.component';
import { ChannelRoutingResolveService } from './channel-routing-resolve.service';

const channelRoute: Routes = [
  {
    path: '',
    component: ChannelComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChannelDetailComponent,
    resolve: {
      channel: ChannelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChannelUpdateComponent,
    resolve: {
      channel: ChannelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChannelUpdateComponent,
    resolve: {
      channel: ChannelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(channelRoute)],
  exports: [RouterModule],
})
export class ChannelRoutingModule {}
