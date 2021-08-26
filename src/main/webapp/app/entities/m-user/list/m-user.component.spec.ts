import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MUserService } from '../service/m-user.service';

import { MUserComponent } from './m-user.component';

describe('Component Tests', () => {
  describe('MUser Management Component', () => {
    let comp: MUserComponent;
    let fixture: ComponentFixture<MUserComponent>;
    let service: MUserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MUserComponent],
      })
        .overrideTemplate(MUserComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MUserComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(MUserService);

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
      expect(comp.mUsers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
