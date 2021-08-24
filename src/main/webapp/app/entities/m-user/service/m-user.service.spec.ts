import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IMUser, MUser } from '../m-user.model';

import { MUserService } from './m-user.service';

describe('Service Tests', () => {
  describe('MUser Service', () => {
    let service: MUserService;
    let httpMock: HttpTestingController;
    let elemDefault: IMUser;
    let expectedResult: IMUser | IMUser[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(MUserService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        username: 'AAAAAAA',
        email: 'AAAAAAA',
        dob: currentDate,
        about: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dob: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a MUser', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dob: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dob: currentDate,
          },
          returnedFromService
        );

        service.create(new MUser()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a MUser', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            username: 'BBBBBB',
            email: 'BBBBBB',
            dob: currentDate.format(DATE_TIME_FORMAT),
            about: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dob: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a MUser', () => {
        const patchObject = Object.assign(
          {
            username: 'BBBBBB',
            dob: currentDate.format(DATE_TIME_FORMAT),
          },
          new MUser()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dob: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of MUser', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            username: 'BBBBBB',
            email: 'BBBBBB',
            dob: currentDate.format(DATE_TIME_FORMAT),
            about: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dob: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a MUser', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addMUserToCollectionIfMissing', () => {
        it('should add a MUser to an empty array', () => {
          const mUser: IMUser = { id: 123 };
          expectedResult = service.addMUserToCollectionIfMissing([], mUser);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(mUser);
        });

        it('should not add a MUser to an array that contains it', () => {
          const mUser: IMUser = { id: 123 };
          const mUserCollection: IMUser[] = [
            {
              ...mUser,
            },
            { id: 456 },
          ];
          expectedResult = service.addMUserToCollectionIfMissing(mUserCollection, mUser);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a MUser to an array that doesn't contain it", () => {
          const mUser: IMUser = { id: 123 };
          const mUserCollection: IMUser[] = [{ id: 456 }];
          expectedResult = service.addMUserToCollectionIfMissing(mUserCollection, mUser);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(mUser);
        });

        it('should add only unique MUser to an array', () => {
          const mUserArray: IMUser[] = [{ id: 123 }, { id: 456 }, { id: 51720 }];
          const mUserCollection: IMUser[] = [{ id: 123 }];
          expectedResult = service.addMUserToCollectionIfMissing(mUserCollection, ...mUserArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const mUser: IMUser = { id: 123 };
          const mUser2: IMUser = { id: 456 };
          expectedResult = service.addMUserToCollectionIfMissing([], mUser, mUser2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(mUser);
          expect(expectedResult).toContain(mUser2);
        });

        it('should accept null and undefined values', () => {
          const mUser: IMUser = { id: 123 };
          expectedResult = service.addMUserToCollectionIfMissing([], null, mUser, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(mUser);
        });

        it('should return initial array if no MUser is added', () => {
          const mUserCollection: IMUser[] = [{ id: 123 }];
          expectedResult = service.addMUserToCollectionIfMissing(mUserCollection, undefined, null);
          expect(expectedResult).toEqual(mUserCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
