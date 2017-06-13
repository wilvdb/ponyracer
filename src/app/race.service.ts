import { Injectable } from '@angular/core';

@Injectable()
export class RaceService {

  constructor() { }

  list() {
    return [
  {name: 'Lyon'},
  {name: 'Los Angeles'},
  {name: 'Sydney'},
  {name: 'Tokyo'},
  {name: 'Casablanca'}
];
  }
}
