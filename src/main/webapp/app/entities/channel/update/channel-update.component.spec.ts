jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ChannelService } from '../service/channel.service';
import { IChannel, Channel } from '../channel.model';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';
import { IMUser } from 'app/entities/m-user/m-user.model';
import { MUserService } from 'app/entities/m-user/service/m-user.service';

import { ChannelUpdateComponent } from './channel-update.component';

describe('Component Tests', () => {
  describe('Channel Management Update Component', () => {
    let comp: ChannelUpdateComponent;
    let fixture: ComponentFixture<ChannelUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let channelService: ChannelService;
    let postService: PostService;
    let mUserService: MUserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ChannelUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ChannelUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ChannelUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      channelService = TestBed.inject(ChannelService);
      postService = TestBed.inject(PostService);
      mUserService = TestBed.inject(MUserService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Post query and add missing value', () => {
        const channel: IChannel = { id: 456 };
        const relatedPosts: IPost[] = [{ id: 87990 }];
        channel.relatedPosts = relatedPosts;

        const postCollection: IPost[] = [{ id: 25473 }];
        jest.spyOn(postService, 'query').mockReturnValue(of(new HttpResponse({ body: postCollection })));
        const additionalPosts = [...relatedPosts];
        const expectedCollection: IPost[] = [...additionalPosts, ...postCollection];
        jest.spyOn(postService, 'addPostToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ channel });
        comp.ngOnInit();

        expect(postService.query).toHaveBeenCalled();
        expect(postService.addPostToCollectionIfMissing).toHaveBeenCalledWith(postCollection, ...additionalPosts);
        expect(comp.postsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call MUser query and add missing value', () => {
        const channel: IChannel = { id: 456 };
        const channelCreator: IMUser = { id: 69027 };
        channel.channelCreator = channelCreator;

        const mUserCollection: IMUser[] = [{ id: 83999 }];
        jest.spyOn(mUserService, 'query').mockReturnValue(of(new HttpResponse({ body: mUserCollection })));
        const additionalMUsers = [channelCreator];
        const expectedCollection: IMUser[] = [...additionalMUsers, ...mUserCollection];
        jest.spyOn(mUserService, 'addMUserToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ channel });
        comp.ngOnInit();

        expect(mUserService.query).toHaveBeenCalled();
        expect(mUserService.addMUserToCollectionIfMissing).toHaveBeenCalledWith(mUserCollection, ...additionalMUsers);
        expect(comp.mUsersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const channel: IChannel = { id: 456 };
        const relatedPosts: IPost = { id: 87495 };
        channel.relatedPosts = [relatedPosts];
        const channelCreator: IMUser = { id: 96202 };
        channel.channelCreator = channelCreator;

        activatedRoute.data = of({ channel });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(channel));
        expect(comp.postsSharedCollection).toContain(relatedPosts);
        expect(comp.mUsersSharedCollection).toContain(channelCreator);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Channel>>();
        const channel = { id: 123 };
        jest.spyOn(channelService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ channel });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: channel }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(channelService.update).toHaveBeenCalledWith(channel);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Channel>>();
        const channel = new Channel();
        jest.spyOn(channelService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ channel });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: channel }));
        saveSubject.complete();

        // THEN
        expect(channelService.create).toHaveBeenCalledWith(channel);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Channel>>();
        const channel = { id: 123 };
        jest.spyOn(channelService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ channel });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(channelService.update).toHaveBeenCalledWith(channel);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackPostById', () => {
        it('Should return tracked Post primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPostById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackMUserById', () => {
        it('Should return tracked MUser primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackMUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedPost', () => {
        it('Should return option if no Post is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedPost(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Post for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedPost(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Post is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedPost(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
