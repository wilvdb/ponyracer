import { TestBed } from '@angular/core/testing';

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
    service.list.and.returnValue([{ name: 'Tokyo' }, { name: 'Paris' }]);

    const fixture = TestBed.createComponent(RacesComponent);
    fixture.detectChanges();

    expect(service.list).toHaveBeenCalled();

    expect(fixture.componentInstance.races).not.toBeNull('You need to have a field `races` initialized with 2 races');
    expect(fixture.componentInstance.races.length).toBe(2, 'You need to have a field `races` initialized with 2 races');
    expect(fixture.componentInstance.races[0].name).toBe('Tokyo');
    expect(fixture.componentInstance.races[1].name).toBe('Paris');

    const element = fixture.nativeElement;
    const raceNames = element.querySelectorAll('h2');
    expect(raceNames.length).toBe(2, 'You should have an `h2` element per race in your template');
    expect(raceNames[0].textContent).toContain('Tokyo');
    expect(raceNames[1].textContent).toContain('Paris');
  });
});
