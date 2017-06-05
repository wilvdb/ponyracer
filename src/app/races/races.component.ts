import { RaceModel } from '../models/race.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pr-races',
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.css']
})
export class RacesComponent implements OnInit {

  races: RaceModel[];

  constructor() { }

  ngOnInit() {
    this.races = [{name: 'Lyon'}, {name: 'London'}];
  }

}
