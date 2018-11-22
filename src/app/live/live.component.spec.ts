import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { AppModule } from '../app.module';
import { LiveComponent } from './live.component';
import { RaceService } from '../race.service';
import { PonyComponent } from '../pony/pony.component';

describe('LiveComponent', () => {

  const fakeRaceService = jasmine.createSpyObj('RaceService', ['get', 'live']);
  fakeRaceService.get.and.returnValue(of({
    id: 1,
    name: 'Lyon',
    ponies: [],
    startInstant: '2016-02-18T08:02:00Z'
  }));
  fakeRaceService.live.and.returnValue(of([]));
  const fakeActivatedRoute = { snapshot: { paramMap: convertToParamMap({ raceId: 1 }) } };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule],
    providers: [
      { provide: RaceService, useValue: fakeRaceService },
      { provide: ActivatedRoute, useValue: fakeActivatedRoute }
    ]
  }));

  it('should display the title', () => {
    const fixture = TestBed.createComponent(LiveComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const title = element.querySelector('h2');
    expect(title).not.toBeNull('The template should display an h2 element with the race name inside');
    expect(title.textContent).toContain('Lyon', 'The template should display an h2 element with the race name inside');
  });

  it('should subscribe to the live observable', () => {
    const fixture = TestBed.createComponent(LiveComponent);
    fixture.detectChanges();
    const liveComponent: LiveComponent = fixture.componentInstance;

    expect(fakeRaceService.live).toHaveBeenCalledWith(1);
    expect(liveComponent.poniesWithPosition).not.toBeNull('poniesWithPosition should be initialized in the subscribe');
    expect(liveComponent.positionSubscription).not.toBeNull('positionSubscription should store the subscription');
  });

  it('should unsubscribe on destruction', () => {
    const fixture = TestBed.createComponent(LiveComponent);
    fixture.detectChanges();
    const liveComponent: LiveComponent = fixture.componentInstance;

    spyOn(liveComponent.positionSubscription, 'unsubscribe');

    liveComponent.ngOnDestroy();

    expect(liveComponent.positionSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should display a div with a pony component per pony', () => {
    const fixture = TestBed.createComponent(LiveComponent);
    fixture.detectChanges();

    const liveComponent: LiveComponent = fixture.componentInstance;
    liveComponent.poniesWithPosition = [
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 10 },
      { id: 2, name: 'Awesome Fridge', color: 'Green', position: 40 }
    ];

    fixture.detectChanges();

    const element = fixture.nativeElement;
    const divWithPonies = element.querySelectorAll('div.pony-wrapper');
    expect(divWithPonies.length).toBe(2, 'You should display a `div` with a class `pony-wrapper` for each pony');

    const debugElement = fixture.debugElement;
    const ponyComponents = debugElement.queryAll(By.directive(PonyComponent));
    expect(ponyComponents).not.toBeNull('You should display a `PonyComponent` for each pony');
    expect(ponyComponents.length).toBe(2, 'You should display a `PonyComponent` for each pony');

    const sunnySunday = ponyComponents[0];
    expect(sunnySunday.componentInstance.isRunning).toBeTruthy('Each pony should be running (use the `isRunning` input)');

    const sunnySundayDiv = divWithPonies[0];
    expect(sunnySundayDiv.getAttribute('style')).toBe('margin-left: 0%;',
      'The `margin-left` style should match the pony\'s position in percent minus 10');
  });
});
