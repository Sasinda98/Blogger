jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PostService } from '../service/post.service';
import { IPost, Post } from '../post.model';
import { IMUser } from 'app/entities/m-user/m-user.model';
import { MUserService } from 'app/entities/m-user/service/m-user.service';

import { PostUpdateComponent } from './post-update.component';

describe('Component Tests', () => {
  describe('Post Management Update Component', () => {
    let comp: PostUpdateComponent;
    let fixture: ComponentFixture<PostUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let postService: PostService;
    let mUserService: MUserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PostUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PostUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PostUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      postService = TestBed.inject(PostService);
      mUserService = TestBed.inject(MUserService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call MUser query and add missing value', () => {
        const post: IPost = { id: 456 };
        const postCreator: IMUser = { id: 9964 };
        post.postCreator = postCreator;

        const mUserCollection: IMUser[] = [{ id: 28783 }];
        jest.spyOn(mUserService, 'query').mockReturnValue(of(new HttpResponse({ body: mUserCollection })));
        const additionalMUsers = [postCreator];
        const expectedCollection: IMUser[] = [...additionalMUsers, ...mUserCollection];
        jest.spyOn(mUserService, 'addMUserToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ post });
        comp.ngOnInit();

        expect(mUserService.query).toHaveBeenCalled();
        expect(mUserService.addMUserToCollectionIfMissing).toHaveBeenCalledWith(mUserCollection, ...additionalMUsers);
        expect(comp.mUsersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const post: IPost = { id: 456 };
        const postCreator: IMUser = { id: 54008 };
        post.postCreator = postCreator;

        activatedRoute.data = of({ post });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(post));
        expect(comp.mUsersSharedCollection).toContain(postCreator);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Post>>();
        const post = { id: 123 };
        jest.spyOn(postService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ post });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: post }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(postService.update).toHaveBeenCalledWith(post);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Post>>();
        const post = new Post();
        jest.spyOn(postService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ post });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: post }));
        saveSubject.complete();

        // THEN
        expect(postService.create).toHaveBeenCalledWith(post);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Post>>();
        const post = { id: 123 };
        jest.spyOn(postService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ post });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(postService.update).toHaveBeenCalledWith(post);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackMUserById', () => {
        it('Should return tracked MUser primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackMUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
