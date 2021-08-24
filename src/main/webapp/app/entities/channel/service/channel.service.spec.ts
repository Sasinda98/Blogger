import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IChannel, Channel } from '../channel.model';

import { ChannelService } from './channel.service';

describe('Service Tests', () => {
  describe('Channel Service', () => {
    let service: ChannelService;
    let httpMock: HttpTestingController;
    let elemDefault: IChannel;
    let expectedResult: IChannel | IChannel[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ChannelService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        createdAt: currentDate,
        modifiedAt: currentDate,
        lastPostAt: currentDate,
        isDeleted: false,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            createdAt: currentDate.format(DATE_TIME_FORMAT),
            modifiedAt: currentDate.format(DATE_TIME_FORMAT),
            lastPostAt: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Channel', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            createdAt: currentDate.format(DATE_TIME_FORMAT),
            modifiedAt: currentDate.format(DATE_TIME_FORMAT),
            lastPostAt: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdAt: currentDate,
            modifiedAt: currentDate,
            lastPostAt: currentDate,
          },
          returnedFromService
        );

        service.create(new Channel()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Channel', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            createdAt: currentDate.format(DATE_TIME_FORMAT),
            modifiedAt: currentDate.format(DATE_TIME_FORMAT),
            lastPostAt: currentDate.format(DATE_TIME_FORMAT),
            isDeleted: true,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdAt: currentDate,
            modifiedAt: currentDate,
            lastPostAt: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Channel', () => {
        const patchObject = Object.assign(
          {
            createdAt: currentDate.format(DATE_TIME_FORMAT),
            modifiedAt: currentDate.format(DATE_TIME_FORMAT),
            isDeleted: true,
          },
          new Channel()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            createdAt: currentDate,
            modifiedAt: currentDate,
            lastPostAt: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Channel', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            createdAt: currentDate.format(DATE_TIME_FORMAT),
            modifiedAt: currentDate.format(DATE_TIME_FORMAT),
            lastPostAt: currentDate.format(DATE_TIME_FORMAT),
            isDeleted: true,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdAt: currentDate,
            modifiedAt: currentDate,
            lastPostAt: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Channel', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addChannelToCollectionIfMissing', () => {
        it('should add a Channel to an empty array', () => {
          const channel: IChannel = { id: 123 };
          expectedResult = service.addChannelToCollectionIfMissing([], channel);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(channel);
        });

        it('should not add a Channel to an array that contains it', () => {
          const channel: IChannel = { id: 123 };
          const channelCollection: IChannel[] = [
            {
              ...channel,
            },
            { id: 456 },
          ];
          expectedResult = service.addChannelToCollectionIfMissing(channelCollection, channel);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Channel to an array that doesn't contain it", () => {
          const channel: IChannel = { id: 123 };
          const channelCollection: IChannel[] = [{ id: 456 }];
          expectedResult = service.addChannelToCollectionIfMissing(channelCollection, channel);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(channel);
        });

        it('should add only unique Channel to an array', () => {
          const channelArray: IChannel[] = [{ id: 123 }, { id: 456 }, { id: 26505 }];
          const channelCollection: IChannel[] = [{ id: 123 }];
          expectedResult = service.addChannelToCollectionIfMissing(channelCollection, ...channelArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const channel: IChannel = { id: 123 };
          const channel2: IChannel = { id: 456 };
          expectedResult = service.addChannelToCollectionIfMissing([], channel, channel2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(channel);
          expect(expectedResult).toContain(channel2);
        });

        it('should accept null and undefined values', () => {
          const channel: IChannel = { id: 123 };
          expectedResult = service.addChannelToCollectionIfMissing([], null, channel, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(channel);
        });

        it('should return initial array if no Channel is added', () => {
          const channelCollection: IChannel[] = [{ id: 123 }];
          expectedResult = service.addChannelToCollectionIfMissing(channelCollection, undefined, null);
          expect(expectedResult).toEqual(channelCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
