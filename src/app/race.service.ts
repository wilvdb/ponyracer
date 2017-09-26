import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { RaceModel } from './models/race.model';

@Injectable()
export class RaceService {

  constructor(private http: HttpClient) {}

  list(): Observable<Array<RaceModel>> {
    const params = new HttpParams().set('status', 'PENDING');
    return this.http.get<Array<RaceModel>>('http://ponyracer.ninja-squad.com/api/races', { params });
  }

}
