import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IUserStatistic, UserStatistic } from '../user-statistic.model';

import { UserStatisticService } from './user-statistic.service';

describe('Service Tests', () => {
  describe('UserStatistic Service', () => {
    let service: UserStatisticService;
    let httpMock: HttpTestingController;
    let elemDefault: IUserStatistic;
    let expectedResult: IUserStatistic | IUserStatistic[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(UserStatisticService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        lastActive: currentDate,
        numberOfPosts: 0,
        numberOfComments: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            lastActive: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a UserStatistic', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            lastActive: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            lastActive: currentDate,
          },
          returnedFromService
        );

        service.create(new UserStatistic()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a UserStatistic', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            lastActive: currentDate.format(DATE_TIME_FORMAT),
            numberOfPosts: 1,
            numberOfComments: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            lastActive: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a UserStatistic', () => {
        const patchObject = Object.assign(
          {
            lastActive: currentDate.format(DATE_TIME_FORMAT),
          },
          new UserStatistic()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            lastActive: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of UserStatistic', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            lastActive: currentDate.format(DATE_TIME_FORMAT),
            numberOfPosts: 1,
            numberOfComments: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            lastActive: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a UserStatistic', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addUserStatisticToCollectionIfMissing', () => {
        it('should add a UserStatistic to an empty array', () => {
          const userStatistic: IUserStatistic = { id: 123 };
          expectedResult = service.addUserStatisticToCollectionIfMissing([], userStatistic);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(userStatistic);
        });

        it('should not add a UserStatistic to an array that contains it', () => {
          const userStatistic: IUserStatistic = { id: 123 };
          const userStatisticCollection: IUserStatistic[] = [
            {
              ...userStatistic,
            },
            { id: 456 },
          ];
          expectedResult = service.addUserStatisticToCollectionIfMissing(userStatisticCollection, userStatistic);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a UserStatistic to an array that doesn't contain it", () => {
          const userStatistic: IUserStatistic = { id: 123 };
          const userStatisticCollection: IUserStatistic[] = [{ id: 456 }];
          expectedResult = service.addUserStatisticToCollectionIfMissing(userStatisticCollection, userStatistic);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(userStatistic);
        });

        it('should add only unique UserStatistic to an array', () => {
          const userStatisticArray: IUserStatistic[] = [{ id: 123 }, { id: 456 }, { id: 71723 }];
          const userStatisticCollection: IUserStatistic[] = [{ id: 123 }];
          expectedResult = service.addUserStatisticToCollectionIfMissing(userStatisticCollection, ...userStatisticArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const userStatistic: IUserStatistic = { id: 123 };
          const userStatistic2: IUserStatistic = { id: 456 };
          expectedResult = service.addUserStatisticToCollectionIfMissing([], userStatistic, userStatistic2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(userStatistic);
          expect(expectedResult).toContain(userStatistic2);
        });

        it('should accept null and undefined values', () => {
          const userStatistic: IUserStatistic = { id: 123 };
          expectedResult = service.addUserStatisticToCollectionIfMissing([], null, userStatistic, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(userStatistic);
        });

        it('should return initial array if no UserStatistic is added', () => {
          const userStatisticCollection: IUserStatistic[] = [{ id: 123 }];
          expectedResult = service.addUserStatisticToCollectionIfMissing(userStatisticCollection, undefined, null);
          expect(expectedResult).toEqual(userStatisticCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
