import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RaceService } from '../race.service';
import { RaceModel } from '../models/race.model';
import { PonyModel } from '../models/pony.model';

@Component({
  selector: 'pr-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.css']
})
export class BetComponent implements OnInit {

  raceModel: RaceModel;
  betFailed = false;

  constructor(private raceService: RaceService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    const raceId = +this.route.snapshot.paramMap.get('raceId');
    this.raceService.get(raceId)
      .subscribe(race => this.raceModel = race);
  }

  betOnPony(pony: PonyModel) {
    if (!this.isPonySelected(pony)) {
      this.raceService.bet(this.raceModel.id, pony.id)
        .subscribe(race => this.raceModel = race, () => this.betFailed = true);
    } else {
      this.raceService.cancelBet(this.raceModel.id)
        .subscribe(() => this.raceModel.betPonyId = null, () => this.betFailed = true);
    }
  }

  isPonySelected(pony: PonyModel) {
    return pony.id === this.raceModel.betPonyId;
  }

}
