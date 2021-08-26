import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMUser, MUser } from '../m-user.model';
import { MUserService } from '../service/m-user.service';

@Injectable({ providedIn: 'root' })
export class MUserRoutingResolveService implements Resolve<IMUser> {
  constructor(protected service: MUserService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMUser> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mUser: HttpResponse<MUser>) => {
          if (mUser.body) {
            return of(mUser.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new MUser());
  }
}
