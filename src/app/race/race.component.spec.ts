import { TestBed } from '@angular/core/testing';

import { AppModule } from '../app.module';
import { RaceComponent } from './race.component';

describe('RaceComponent', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule]
  }));

  it('should display a race name and its ponies', () => {
    const fixture = TestBed.createComponent(RaceComponent);

    // given a race in Paris with 5 ponies
    const raceComponent = fixture.componentInstance;
    raceComponent.raceModel = {
      id: 12,
      name: 'Paris',
      ponies: [
        { id: 1, name: 'Gentle Pie', color: 'YELLOW' },
        { id: 2, name: 'Big Soda', color: 'ORANGE' },
        { id: 3, name: 'Gentle Bottle', color: 'PURPLE' },
        { id: 4, name: 'Superb Whiskey', color: 'GREEN' },
        { id: 5, name: 'Fast Rainbow', color: 'BLUE' }
      ],
      startInstant: '2016-02-18T08:02:00Z'
    };

    // when triggering the change detection
    fixture.detectChanges();

    // then we should have the name and ponies displayed in the template
    const element = fixture.nativeElement;
    const raceName = element.querySelector('h2');
    expect(raceName).not.toBeNull('You need an h2 element for the race name');
    expect(raceName.textContent).toContain('Paris', 'The h2 element should contain the race name');
    const ponies = element.querySelectorAll('li');
    expect(ponies.length).toBe(5, 'You should have one li elements per pony');
    expect(ponies[0].textContent).toContain('Gentle Pie');
    expect(ponies[1].textContent).toContain('Big Soda');
    expect(ponies[2].textContent).toContain('Gentle Bottle');
    expect(ponies[3].textContent).toContain('Superb Whiskey');
    expect(ponies[4].textContent).toContain('Fast Rainbow');
  });
});
