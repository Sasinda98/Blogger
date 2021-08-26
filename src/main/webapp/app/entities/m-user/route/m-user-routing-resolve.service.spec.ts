jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IMUser, MUser } from '../m-user.model';
import { MUserService } from '../service/m-user.service';

import { MUserRoutingResolveService } from './m-user-routing-resolve.service';

describe('Service Tests', () => {
  describe('MUser routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: MUserRoutingResolveService;
    let service: MUserService;
    let resultMUser: IMUser | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(MUserRoutingResolveService);
      service = TestBed.inject(MUserService);
      resultMUser = undefined;
    });

    describe('resolve', () => {
      it('should return IMUser returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMUser = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMUser).toEqual({ id: 123 });
      });

      it('should return new IMUser if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMUser = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultMUser).toEqual(new MUser());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as MUser })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMUser = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMUser).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
