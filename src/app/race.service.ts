import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { environment } from '../environments/environment';
import { RaceModel } from './models/race.model';
import { PonyWithPositionModel } from './models/pony.model';

@Injectable()
export class RaceService {

  constructor(private http: HttpClient) {}

  list(): Observable<Array<RaceModel>> {
    const params = { status: 'PENDING' };
    return this.http.get<Array<RaceModel>>(`${environment.baseUrl}/api/races`, { params });
  }

  get(raceId): Observable<RaceModel> {
    return this.http.get<RaceModel>(`${environment.baseUrl}/api/races/${raceId}`);
  }

  bet(raceId, ponyId): Observable<RaceModel> {
    return this.http.post<RaceModel>(`${environment.baseUrl}/api/races/${raceId}/bets`, { ponyId });
  }

  cancelBet(raceId): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/api/races/${raceId}/bets`);
  }

  live(raceId): Observable<Array<PonyWithPositionModel>> {
    return Observable
      .interval(1000)
      .take(101)
      .map(position => {
        return [{
          id: 1,
          name: 'Superb Runner',
          color: 'BLUE',
          position
        }, {
          id: 2,
          name: 'Awesome Fridge',
          color: 'GREEN',
          position
        }, {
          id: 3,
          name: 'Great Bottle',
          color: 'ORANGE',
          position
        }, {
          id: 4,
          name: 'Little Flower',
          color: 'YELLOW',
          position
        }, {
          id: 5,
          name: 'Nice Rock',
          color: 'PURPLE',
          position
        }];
      });
  }

}
