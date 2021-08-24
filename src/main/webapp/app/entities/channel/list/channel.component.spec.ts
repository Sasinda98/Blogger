import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ChannelService } from '../service/channel.service';

import { ChannelComponent } from './channel.component';

describe('Component Tests', () => {
  describe('Channel Management Component', () => {
    let comp: ChannelComponent;
    let fixture: ComponentFixture<ChannelComponent>;
    let service: ChannelService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ChannelComponent],
      })
        .overrideTemplate(ChannelComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ChannelComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ChannelService);

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
      expect(comp.channels?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
