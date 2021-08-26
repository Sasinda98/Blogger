jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { UserStatisticService } from '../service/user-statistic.service';
import { IUserStatistic, UserStatistic } from '../user-statistic.model';

import { UserStatisticUpdateComponent } from './user-statistic-update.component';

describe('Component Tests', () => {
  describe('UserStatistic Management Update Component', () => {
    let comp: UserStatisticUpdateComponent;
    let fixture: ComponentFixture<UserStatisticUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let userStatisticService: UserStatisticService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [UserStatisticUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(UserStatisticUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UserStatisticUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      userStatisticService = TestBed.inject(UserStatisticService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const userStatistic: IUserStatistic = { id: 456 };

        activatedRoute.data = of({ userStatistic });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(userStatistic));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserStatistic>>();
        const userStatistic = { id: 123 };
        jest.spyOn(userStatisticService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userStatistic });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: userStatistic }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(userStatisticService.update).toHaveBeenCalledWith(userStatistic);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserStatistic>>();
        const userStatistic = new UserStatistic();
        jest.spyOn(userStatisticService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userStatistic });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: userStatistic }));
        saveSubject.complete();

        // THEN
        expect(userStatisticService.create).toHaveBeenCalledWith(userStatistic);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserStatistic>>();
        const userStatistic = { id: 123 };
        jest.spyOn(userStatisticService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userStatistic });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(userStatisticService.update).toHaveBeenCalledWith(userStatistic);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
