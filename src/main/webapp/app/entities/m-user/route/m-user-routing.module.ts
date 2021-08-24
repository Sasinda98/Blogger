import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MUserComponent } from '../list/m-user.component';
import { MUserDetailComponent } from '../detail/m-user-detail.component';
import { MUserUpdateComponent } from '../update/m-user-update.component';
import { MUserRoutingResolveService } from './m-user-routing-resolve.service';

const mUserRoute: Routes = [
  {
    path: '',
    component: MUserComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MUserDetailComponent,
    resolve: {
      mUser: MUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MUserUpdateComponent,
    resolve: {
      mUser: MUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MUserUpdateComponent,
    resolve: {
      mUser: MUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mUserRoute)],
  exports: [RouterModule],
})
export class MUserRoutingModule {}
