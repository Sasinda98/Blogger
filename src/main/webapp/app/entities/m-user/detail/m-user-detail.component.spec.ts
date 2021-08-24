import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MUserDetailComponent } from './m-user-detail.component';

describe('Component Tests', () => {
  describe('MUser Management Detail Component', () => {
    let comp: MUserDetailComponent;
    let fixture: ComponentFixture<MUserDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [MUserDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ mUser: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(MUserDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MUserDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load mUser on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.mUser).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
