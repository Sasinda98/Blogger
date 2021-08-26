import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UserStatisticService } from '../service/user-statistic.service';

import { UserStatisticComponent } from './user-statistic.component';

describe('Component Tests', () => {
  describe('UserStatistic Management Component', () => {
    let comp: UserStatisticComponent;
    let fixture: ComponentFixture<UserStatisticComponent>;
    let service: UserStatisticService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [UserStatisticComponent],
      })
        .overrideTemplate(UserStatisticComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UserStatisticComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(UserStatisticService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.userStatistics?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
