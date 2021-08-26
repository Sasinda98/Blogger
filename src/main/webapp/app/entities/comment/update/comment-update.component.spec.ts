jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CommentService } from '../service/comment.service';
import { IComment, Comment } from '../comment.model';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';
import { IMUser } from 'app/entities/m-user/m-user.model';
import { MUserService } from 'app/entities/m-user/service/m-user.service';

import { CommentUpdateComponent } from './comment-update.component';

describe('Component Tests', () => {
  describe('Comment Management Update Component', () => {
    let comp: CommentUpdateComponent;
    let fixture: ComponentFixture<CommentUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let commentService: CommentService;
    let postService: PostService;
    let mUserService: MUserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CommentUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CommentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CommentUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      commentService = TestBed.inject(CommentService);
      postService = TestBed.inject(PostService);
      mUserService = TestBed.inject(MUserService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Post query and add missing value', () => {
        const comment: IComment = { id: 456 };
        const linkedPost: IPost = { id: 35103 };
        comment.linkedPost = linkedPost;

        const postCollection: IPost[] = [{ id: 33872 }];
        jest.spyOn(postService, 'query').mockReturnValue(of(new HttpResponse({ body: postCollection })));
        const additionalPosts = [linkedPost];
        const expectedCollection: IPost[] = [...additionalPosts, ...postCollection];
        jest.spyOn(postService, 'addPostToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ comment });
        comp.ngOnInit();

        expect(postService.query).toHaveBeenCalled();
        expect(postService.addPostToCollectionIfMissing).toHaveBeenCalledWith(postCollection, ...additionalPosts);
        expect(comp.postsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call MUser query and add missing value', () => {
        const comment: IComment = { id: 456 };
        const commentCreator: IMUser = { id: 77090 };
        comment.commentCreator = commentCreator;

        const mUserCollection: IMUser[] = [{ id: 33895 }];
        jest.spyOn(mUserService, 'query').mockReturnValue(of(new HttpResponse({ body: mUserCollection })));
        const additionalMUsers = [commentCreator];
        const expectedCollection: IMUser[] = [...additionalMUsers, ...mUserCollection];
        jest.spyOn(mUserService, 'addMUserToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ comment });
        comp.ngOnInit();

        expect(mUserService.query).toHaveBeenCalled();
        expect(mUserService.addMUserToCollectionIfMissing).toHaveBeenCalledWith(mUserCollection, ...additionalMUsers);
        expect(comp.mUsersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const comment: IComment = { id: 456 };
        const linkedPost: IPost = { id: 87352 };
        comment.linkedPost = linkedPost;
        const commentCreator: IMUser = { id: 91997 };
        comment.commentCreator = commentCreator;

        activatedRoute.data = of({ comment });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(comment));
        expect(comp.postsSharedCollection).toContain(linkedPost);
        expect(comp.mUsersSharedCollection).toContain(commentCreator);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Comment>>();
        const comment = { id: 123 };
        jest.spyOn(commentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ comment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: comment }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(commentService.update).toHaveBeenCalledWith(comment);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Comment>>();
        const comment = new Comment();
        jest.spyOn(commentService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ comment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: comment }));
        saveSubject.complete();

        // THEN
        expect(commentService.create).toHaveBeenCalledWith(comment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Comment>>();
        const comment = { id: 123 };
        jest.spyOn(commentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ comment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(commentService.update).toHaveBeenCalledWith(comment);
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
  });
});
