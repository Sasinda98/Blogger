import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserStatistic, UserStatistic } from '../user-statistic.model';
import { UserStatisticService } from '../service/user-statistic.service';

@Injectable({ providedIn: 'root' })
export class UserStatisticRoutingResolveService implements Resolve<IUserStatistic> {
  constructor(protected service: UserStatisticService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserStatistic> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userStatistic: HttpResponse<UserStatistic>) => {
          if (userStatistic.body) {
            return of(userStatistic.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new UserStatistic());
  }
}
