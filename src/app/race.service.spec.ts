import { TestBed } from '@angular/core/testing';

import { RaceService } from './race.service';

describe('RaceService', () => {

  let service: RaceService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [RaceService]
  }));

  beforeEach(() => service = TestBed.get(RaceService));

  it('should list races', () => {
    const races = service.list();
    expect(races.length).toBe(5, 'The service should return five races for the `list()` method');
  });

});
