import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AppModule } from '../app.module';
import { RacesComponent } from './races.component';
import { RaceService } from '../race.service';

describe('RacesComponent', () => {

  const service = jasmine.createSpyObj('RaceService', ['list']);

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule],
    providers: [{ provide: RaceService, useValue: service }]
  }));

  it('should display every race name in a title', () => {
    service.list.and.returnValue(Observable.of([
      {name: 'Lyon'},
      {name: 'Los Angeles'},
      {name: 'Sydney'},
      {name: 'Tokyo'},
      {name: 'Casablanca'}
    ]));

    const fixture = TestBed.createComponent(RacesComponent);
    fixture.detectChanges();

    expect(service.list).toHaveBeenCalled();

    expect(fixture.componentInstance.races).not.toBeNull('You need to have a field `races` initialized with 5 races');
    expect(fixture.componentInstance.races.length).toBe(5, 'You need to have a field `races` initialized with 5 races');
    expect(fixture.componentInstance.races[0].name).toBe('Lyon');
    expect(fixture.componentInstance.races[1].name).toBe('Los Angeles');
    expect(fixture.componentInstance.races[2].name).toBe('Sydney');
    expect(fixture.componentInstance.races[3].name).toBe('Tokyo');
    expect(fixture.componentInstance.races[4].name).toBe('Casablanca');

    const element = fixture.nativeElement;
    const raceNames = element.querySelectorAll('h2');
    expect(raceNames.length).toBe(4, 'You should have four `h2` elements, use the `slice` pipe');
    expect(raceNames[0].textContent).toContain('Lyon');
    expect(raceNames[1].textContent).toContain('Los Angeles');
    expect(raceNames[2].textContent).toContain('Sydney');
    expect(raceNames[3].textContent).toContain('Tokyo');
  });
});
