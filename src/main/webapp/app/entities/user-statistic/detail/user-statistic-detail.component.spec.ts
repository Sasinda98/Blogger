import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserStatisticDetailComponent } from './user-statistic-detail.component';

describe('Component Tests', () => {
  describe('UserStatistic Management Detail Component', () => {
    let comp: UserStatisticDetailComponent;
    let fixture: ComponentFixture<UserStatisticDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [UserStatisticDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ userStatistic: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(UserStatisticDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(UserStatisticDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load userStatistic on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.userStatistic).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
