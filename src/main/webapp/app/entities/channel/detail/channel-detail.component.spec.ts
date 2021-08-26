import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChannelDetailComponent } from './channel-detail.component';

describe('Component Tests', () => {
  describe('Channel Management Detail Component', () => {
    let comp: ChannelDetailComponent;
    let fixture: ComponentFixture<ChannelDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ChannelDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ channel: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ChannelDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ChannelDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load channel on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.channel).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
