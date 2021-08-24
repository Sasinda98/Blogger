import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MUserComponent } from './list/m-user.component';
import { MUserDetailComponent } from './detail/m-user-detail.component';
import { MUserUpdateComponent } from './update/m-user-update.component';
import { MUserDeleteDialogComponent } from './delete/m-user-delete-dialog.component';
import { MUserRoutingModule } from './route/m-user-routing.module';

@NgModule({
  imports: [SharedModule, MUserRoutingModule],
  declarations: [MUserComponent, MUserDetailComponent, MUserUpdateComponent, MUserDeleteDialogComponent],
  entryComponents: [MUserDeleteDialogComponent],
})
export class MUserModule {}
