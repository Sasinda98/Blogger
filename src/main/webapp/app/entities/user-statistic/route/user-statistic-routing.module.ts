import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserStatisticComponent } from '../list/user-statistic.component';
import { UserStatisticDetailComponent } from '../detail/user-statistic-detail.component';
import { UserStatisticUpdateComponent } from '../update/user-statistic-update.component';
import { UserStatisticRoutingResolveService } from './user-statistic-routing-resolve.service';

const userStatisticRoute: Routes = [
  {
    path: '',
    component: UserStatisticComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserStatisticDetailComponent,
    resolve: {
      userStatistic: UserStatisticRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserStatisticUpdateComponent,
    resolve: {
      userStatistic: UserStatisticRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserStatisticUpdateComponent,
    resolve: {
      userStatistic: UserStatisticRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userStatisticRoute)],
  exports: [RouterModule],
})
export class UserStatisticRoutingModule {}
