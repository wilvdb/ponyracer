import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { RaceModel } from './models/race.model';

@Injectable()
export class RaceService {

  constructor(private http: Http) {}

  list(): Observable<Array<RaceModel>> {
    return this.http.get('http://ponyracer.ninja-squad.com/api/races', { params: { status: 'PENDING' } })
      .map(res => res.json());
  }

}
