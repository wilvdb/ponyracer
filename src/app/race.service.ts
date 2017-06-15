import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { RaceModel } from './models/race.model';

@Injectable()
export class RaceService {

  constructor() {}

  list(): Observable<RaceModel[]> {
    return Observable.of([
      {name: 'Lyon'},
      {name: 'Los Angeles'},
      {name: 'Sydney'},
      {name: 'Tokyo'},
      {name: 'Casablanca'}
    ]);
  }

}
