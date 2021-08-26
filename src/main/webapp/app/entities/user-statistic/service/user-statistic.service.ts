import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserStatistic, getUserStatisticIdentifier } from '../user-statistic.model';

export type EntityResponseType = HttpResponse<IUserStatistic>;
export type EntityArrayResponseType = HttpResponse<IUserStatistic[]>;

@Injectable({ providedIn: 'root' })
export class UserStatisticService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-statistics');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userStatistic: IUserStatistic): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userStatistic);
    return this.http
      .post<IUserStatistic>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(userStatistic: IUserStatistic): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userStatistic);
    return this.http
      .put<IUserStatistic>(`${this.resourceUrl}/${getUserStatisticIdentifier(userStatistic) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(userStatistic: IUserStatistic): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userStatistic);
    return this.http
      .patch<IUserStatistic>(`${this.resourceUrl}/${getUserStatisticIdentifier(userStatistic) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IUserStatistic>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IUserStatistic[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUserStatisticToCollectionIfMissing(
    userStatisticCollection: IUserStatistic[],
    ...userStatisticsToCheck: (IUserStatistic | null | undefined)[]
  ): IUserStatistic[] {
    const userStatistics: IUserStatistic[] = userStatisticsToCheck.filter(isPresent);
    if (userStatistics.length > 0) {
      const userStatisticCollectionIdentifiers = userStatisticCollection.map(
        userStatisticItem => getUserStatisticIdentifier(userStatisticItem)!
      );
      const userStatisticsToAdd = userStatistics.filter(userStatisticItem => {
        const userStatisticIdentifier = getUserStatisticIdentifier(userStatisticItem);
        if (userStatisticIdentifier == null || userStatisticCollectionIdentifiers.includes(userStatisticIdentifier)) {
          return false;
        }
        userStatisticCollectionIdentifiers.push(userStatisticIdentifier);
        return true;
      });
      return [...userStatisticsToAdd, ...userStatisticCollection];
    }
    return userStatisticCollection;
  }

  protected convertDateFromClient(userStatistic: IUserStatistic): IUserStatistic {
    return Object.assign({}, userStatistic, {
      lastActive: userStatistic.lastActive?.isValid() ? userStatistic.lastActive.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.lastActive = res.body.lastActive ? dayjs(res.body.lastActive) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((userStatistic: IUserStatistic) => {
        userStatistic.lastActive = userStatistic.lastActive ? dayjs(userStatistic.lastActive) : undefined;
      });
    }
    return res;
  }
}
