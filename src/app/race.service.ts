import { Injectable } from '@angular/core';

@Injectable()
export class RaceService {

  constructor() { }

  list() {
    return [{name: 'Lyon'}, {name: 'London'}];
  }
}
