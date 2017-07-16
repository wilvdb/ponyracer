import { Component, Input, OnInit } from '@angular/core';

import { RaceModel } from '../models/race.model';

@Component({
  selector: 'pr-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.css']
})
export class RaceComponent implements OnInit {

  @Input() raceModel: RaceModel;

  constructor() {}

  ngOnInit() {
  }

}
