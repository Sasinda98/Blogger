import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'm-user',
        data: { pageTitle: 'MUsers' },
        loadChildren: () => import('./m-user/m-user.module').then(m => m.MUserModule),
      },
      {
        path: 'user-statistic',
        data: { pageTitle: 'UserStatistics' },
        loadChildren: () => import('./user-statistic/user-statistic.module').then(m => m.UserStatisticModule),
      },
      {
        path: 'channel',
        data: { pageTitle: 'Channels' },
        loadChildren: () => import('./channel/channel.module').then(m => m.ChannelModule),
      },
      {
        path: 'post',
        data: { pageTitle: 'Posts' },
        loadChildren: () => import('./post/post.module').then(m => m.PostModule),
      },
      {
        path: 'comment',
        data: { pageTitle: 'Comments' },
        loadChildren: () => import('./comment/comment.module').then(m => m.CommentModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
