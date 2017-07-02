import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AppModule } from '../app.module';
import { RacesComponent } from './races.component';
import { RaceComponent } from '../race/race.component';
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

    const debugElement = fixture.debugElement;
    const raceNames = debugElement.queryAll(By.directive(RaceComponent));
    expect(raceNames.length).toBe(4, 'You should have four `RaceComponent` displayed, use the `slice` pipe');
  });
});
