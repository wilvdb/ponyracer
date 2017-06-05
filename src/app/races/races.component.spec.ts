import { TestBed } from '@angular/core/testing';

import { AppModule } from '../app.module';
import { RacesComponent } from './races.component';

describe('RacesComponent', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule]
  }));

  it('should display every race name in a title', () => {
    const fixture = TestBed.createComponent(RacesComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.races).not.toBeNull('You need to have a field `races` initialized with 2 races');
    expect(fixture.componentInstance.races.length).toBe(2, 'You need to have a field `races` initialized with 2 races');
    expect(fixture.componentInstance.races[0].name).toBe('Lyon');
    expect(fixture.componentInstance.races[1].name).toBe('London');

    const element = fixture.nativeElement;
    const raceNames = element.querySelectorAll('h2');
    expect(raceNames.length).toBe(2, 'You should have an `h2` element per race in your template');
    expect(raceNames[0].textContent).toContain('Lyon');
    expect(raceNames[1].textContent).toContain('London');
  });
});
