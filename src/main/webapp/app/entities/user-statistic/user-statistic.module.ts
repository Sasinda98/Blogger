import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserStatisticComponent } from './list/user-statistic.component';
import { UserStatisticDetailComponent } from './detail/user-statistic-detail.component';
import { UserStatisticUpdateComponent } from './update/user-statistic-update.component';
import { UserStatisticDeleteDialogComponent } from './delete/user-statistic-delete-dialog.component';
import { UserStatisticRoutingModule } from './route/user-statistic-routing.module';

@NgModule({
  imports: [SharedModule, UserStatisticRoutingModule],
  declarations: [UserStatisticComponent, UserStatisticDetailComponent, UserStatisticUpdateComponent, UserStatisticDeleteDialogComponent],
  entryComponents: [UserStatisticDeleteDialogComponent],
})
export class UserStatisticModule {}
