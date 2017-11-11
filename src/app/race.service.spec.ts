import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from '../environments/environment';
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

    http.expectOne(`${environment.baseUrl}/api/races?status=PENDING`)
      .flush(hardcodedRaces);

    expect(actualRaces).toEqual(hardcodedRaces, 'The `list` method should return an array of RaceModel wrapped in an Observable');
  });

  it('should get a race', () => {
    // fake response
    const race = { name: 'Paris' } as RaceModel;
    const raceId = 1;

    let actualRace;
    raceService.get(raceId).subscribe(fetchedRace => actualRace = fetchedRace);

    http.expectOne(`${environment.baseUrl}/api/races/${raceId}`)
      .flush(race);

    expect(actualRace).toBe(race, 'The observable must emit the race');
  });

  it('should bet on a race', () => {
    // fake response
    const race = { name: 'Paris' } as RaceModel;
    const raceId = 1;
    const ponyId = 2;

    let actualRace;
    raceService.bet(raceId, ponyId).subscribe(fetchedRace => actualRace = fetchedRace);

    const req = http.expectOne({ method: 'POST', url: `${environment.baseUrl}/api/races/${raceId}/bets` });
    expect(req.request.body).toEqual({ ponyId });
    req.flush(race);

    expect(actualRace).toBe(race, 'The observable must emit the race');
  });

});
