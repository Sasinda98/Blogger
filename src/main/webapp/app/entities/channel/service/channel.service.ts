import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChannel, getChannelIdentifier } from '../channel.model';

export type EntityResponseType = HttpResponse<IChannel>;
export type EntityArrayResponseType = HttpResponse<IChannel[]>;

@Injectable({ providedIn: 'root' })
export class ChannelService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/channels');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(channel: IChannel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(channel);
    return this.http
      .post<IChannel>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(channel: IChannel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(channel);
    return this.http
      .put<IChannel>(`${this.resourceUrl}/${getChannelIdentifier(channel) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(channel: IChannel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(channel);
    return this.http
      .patch<IChannel>(`${this.resourceUrl}/${getChannelIdentifier(channel) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IChannel>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IChannel[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addChannelToCollectionIfMissing(channelCollection: IChannel[], ...channelsToCheck: (IChannel | null | undefined)[]): IChannel[] {
    const channels: IChannel[] = channelsToCheck.filter(isPresent);
    if (channels.length > 0) {
      const channelCollectionIdentifiers = channelCollection.map(channelItem => getChannelIdentifier(channelItem)!);
      const channelsToAdd = channels.filter(channelItem => {
        const channelIdentifier = getChannelIdentifier(channelItem);
        if (channelIdentifier == null || channelCollectionIdentifiers.includes(channelIdentifier)) {
          return false;
        }
        channelCollectionIdentifiers.push(channelIdentifier);
        return true;
      });
      return [...channelsToAdd, ...channelCollection];
    }
    return channelCollection;
  }

  protected convertDateFromClient(channel: IChannel): IChannel {
    return Object.assign({}, channel, {
      createdAt: channel.createdAt?.isValid() ? channel.createdAt.toJSON() : undefined,
      modifiedAt: channel.modifiedAt?.isValid() ? channel.modifiedAt.toJSON() : undefined,
      lastPostAt: channel.lastPostAt?.isValid() ? channel.lastPostAt.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdAt = res.body.createdAt ? dayjs(res.body.createdAt) : undefined;
      res.body.modifiedAt = res.body.modifiedAt ? dayjs(res.body.modifiedAt) : undefined;
      res.body.lastPostAt = res.body.lastPostAt ? dayjs(res.body.lastPostAt) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((channel: IChannel) => {
        channel.createdAt = channel.createdAt ? dayjs(channel.createdAt) : undefined;
        channel.modifiedAt = channel.modifiedAt ? dayjs(channel.modifiedAt) : undefined;
        channel.lastPostAt = channel.lastPostAt ? dayjs(channel.lastPostAt) : undefined;
      });
    }
    return res;
  }
}
