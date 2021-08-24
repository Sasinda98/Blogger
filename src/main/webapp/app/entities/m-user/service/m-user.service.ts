import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMUser, getMUserIdentifier } from '../m-user.model';

export type EntityResponseType = HttpResponse<IMUser>;
export type EntityArrayResponseType = HttpResponse<IMUser[]>;

@Injectable({ providedIn: 'root' })
export class MUserService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/m-users');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mUser: IMUser): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mUser);
    return this.http
      .post<IMUser>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(mUser: IMUser): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mUser);
    return this.http
      .put<IMUser>(`${this.resourceUrl}/${getMUserIdentifier(mUser) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(mUser: IMUser): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mUser);
    return this.http
      .patch<IMUser>(`${this.resourceUrl}/${getMUserIdentifier(mUser) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IMUser>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IMUser[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMUserToCollectionIfMissing(mUserCollection: IMUser[], ...mUsersToCheck: (IMUser | null | undefined)[]): IMUser[] {
    const mUsers: IMUser[] = mUsersToCheck.filter(isPresent);
    if (mUsers.length > 0) {
      const mUserCollectionIdentifiers = mUserCollection.map(mUserItem => getMUserIdentifier(mUserItem)!);
      const mUsersToAdd = mUsers.filter(mUserItem => {
        const mUserIdentifier = getMUserIdentifier(mUserItem);
        if (mUserIdentifier == null || mUserCollectionIdentifiers.includes(mUserIdentifier)) {
          return false;
        }
        mUserCollectionIdentifiers.push(mUserIdentifier);
        return true;
      });
      return [...mUsersToAdd, ...mUserCollection];
    }
    return mUserCollection;
  }

  protected convertDateFromClient(mUser: IMUser): IMUser {
    return Object.assign({}, mUser, {
      dob: mUser.dob?.isValid() ? mUser.dob.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dob = res.body.dob ? dayjs(res.body.dob) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((mUser: IMUser) => {
        mUser.dob = mUser.dob ? dayjs(mUser.dob) : undefined;
      });
    }
    return res;
  }
}
