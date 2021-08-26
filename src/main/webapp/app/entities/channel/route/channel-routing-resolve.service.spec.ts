jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IChannel, Channel } from '../channel.model';
import { ChannelService } from '../service/channel.service';

import { ChannelRoutingResolveService } from './channel-routing-resolve.service';

describe('Service Tests', () => {
  describe('Channel routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ChannelRoutingResolveService;
    let service: ChannelService;
    let resultChannel: IChannel | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ChannelRoutingResolveService);
      service = TestBed.inject(ChannelService);
      resultChannel = undefined;
    });

    describe('resolve', () => {
      it('should return IChannel returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultChannel = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultChannel).toEqual({ id: 123 });
      });

      it('should return new IChannel if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultChannel = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultChannel).toEqual(new Channel());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Channel })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultChannel = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultChannel).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
