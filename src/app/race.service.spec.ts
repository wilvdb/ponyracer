import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RaceService } from './race.service';
import { RaceModel } from './models/race.model';

describe('RaceService', () => {

  let raceService: RaceService;
  let http: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [RaceService]
  }));

  beforeEach(() => {
    raceService = TestBed.get(RaceService);
    http = TestBed.get(HttpTestingController);
  });

  it('should return an Observable of 3 races', () => {
    // fake response
    const hardcodedRaces = [{ name: 'Paris' }, { name: 'Tokyo' }, { name: 'Lyon' }];

    let actualRaces = [];
    raceService.list().subscribe((races: Array<RaceModel>) => actualRaces = races);

    http.expectOne('http://ponyracer.ninja-squad.com/api/races?status=PENDING')
      .flush(hardcodedRaces);

    expect(actualRaces).toEqual(hardcodedRaces, 'The `list` method should return an array of RaceModel wrapped in an Observable');
  });

});
