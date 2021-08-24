jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MUserService } from '../service/m-user.service';
import { IMUser, MUser } from '../m-user.model';
import { IUserStatistic } from 'app/entities/user-statistic/user-statistic.model';
import { UserStatisticService } from 'app/entities/user-statistic/service/user-statistic.service';

import { MUserUpdateComponent } from './m-user-update.component';

describe('Component Tests', () => {
  describe('MUser Management Update Component', () => {
    let comp: MUserUpdateComponent;
    let fixture: ComponentFixture<MUserUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let mUserService: MUserService;
    let userStatisticService: UserStatisticService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MUserUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MUserUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MUserUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      mUserService = TestBed.inject(MUserService);
      userStatisticService = TestBed.inject(UserStatisticService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call userStatistic query and add missing value', () => {
        const mUser: IMUser = { id: 456 };
        const userStatistic: IUserStatistic = { id: 93753 };
        mUser.userStatistic = userStatistic;

        const userStatisticCollection: IUserStatistic[] = [{ id: 86225 }];
        jest.spyOn(userStatisticService, 'query').mockReturnValue(of(new HttpResponse({ body: userStatisticCollection })));
        const expectedCollection: IUserStatistic[] = [userStatistic, ...userStatisticCollection];
        jest.spyOn(userStatisticService, 'addUserStatisticToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ mUser });
        comp.ngOnInit();

        expect(userStatisticService.query).toHaveBeenCalled();
        expect(userStatisticService.addUserStatisticToCollectionIfMissing).toHaveBeenCalledWith(userStatisticCollection, userStatistic);
        expect(comp.userStatisticsCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const mUser: IMUser = { id: 456 };
        const userStatistic: IUserStatistic = { id: 77405 };
        mUser.userStatistic = userStatistic;

        activatedRoute.data = of({ mUser });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(mUser));
        expect(comp.userStatisticsCollection).toContain(userStatistic);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<MUser>>();
        const mUser = { id: 123 };
        jest.spyOn(mUserService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ mUser });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: mUser }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(mUserService.update).toHaveBeenCalledWith(mUser);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<MUser>>();
        const mUser = new MUser();
        jest.spyOn(mUserService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ mUser });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: mUser }));
        saveSubject.complete();

        // THEN
        expect(mUserService.create).toHaveBeenCalledWith(mUser);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<MUser>>();
        const mUser = { id: 123 };
        jest.spyOn(mUserService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ mUser });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(mUserService.update).toHaveBeenCalledWith(mUser);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserStatisticById', () => {
        it('Should return tracked UserStatistic primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserStatisticById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
