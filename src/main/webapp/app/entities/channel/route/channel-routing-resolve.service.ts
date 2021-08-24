import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChannel, Channel } from '../channel.model';
import { ChannelService } from '../service/channel.service';

@Injectable({ providedIn: 'root' })
export class ChannelRoutingResolveService implements Resolve<IChannel> {
  constructor(protected service: ChannelService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChannel> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((channel: HttpResponse<Channel>) => {
          if (channel.body) {
            return of(channel.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Channel());
  }
}
