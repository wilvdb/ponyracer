import { RaceModel } from '../models/race.model';
import { Component, OnInit } from '@angular/core';

import { RaceService } from '../race.service';

@Component({
  selector: 'pr-races',
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.css']
})
export class RacesComponent implements OnInit {

  races: RaceModel[];

  constructor(public raceService: RaceService) { }

  ngOnInit() {
    this.races = this.raceService.list();
  }

}
