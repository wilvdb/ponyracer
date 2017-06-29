import { async, TestBed } from '@angular/core/testing';

import { RaceService } from './race.service';
import { RaceModel } from './models/race.model';

describe('RaceService', () => {

  let service: RaceService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [RaceService]
  }));

  beforeEach(() => service = TestBed.get(RaceService));

  it('should list races', async(() => {
    const observable = service.list();
    observable.subscribe((races: Array<RaceModel>) => {
      expect(races.length).toBe(2, 'The service should return two races');
      const paris = races[0];
      expect(paris.name).toBe('Paris');
      expect(paris.ponies.length).toBe(5, 'The races should include the ponies');
    });
  }));

});
