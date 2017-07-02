import { async, TestBed } from '@angular/core/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import 'rxjs/add/observable/of';

import { RaceService } from './race.service';
import { RaceModel } from './models/race.model';

describe('RaceService', () => {

  let raceService: RaceService;
  let mockBackend: MockBackend;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      MockBackend,
      BaseRequestOptions,
      {
        provide: Http,
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      },
      RaceService
    ]
  }));

  beforeEach(() => {
    raceService = TestBed.get(RaceService);
    mockBackend = TestBed.get(MockBackend);
  });

  it('should return an Observable of 3 races', async(() => {
    // fake response
    const hardcodedRaces = [{ name: 'Paris' }, { name: 'Tokyo' }, { name: 'Lyon' }];
    const response = new Response(new ResponseOptions({ body: hardcodedRaces }));
    // return the response if we have a connection to the MockBackend
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url)
        .toBe('http://ponyracer.ninja-squad.com/api/races?status=PENDING', 'The URL requested is not correct');
      expect(connection.request.method).toBe(RequestMethod.Get);
      connection.mockRespond(response);
    });

    raceService.list().subscribe((races: Array<RaceModel>) => {
      expect(races.length).toBe(3, 'The `list` method should return an array of RaceModel wrapped in an Observable');
    });
  }));

});
