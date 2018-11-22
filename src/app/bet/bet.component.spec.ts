import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { AppModule } from '../app.module';
import { RaceService } from '../race.service';
import { BetComponent } from './bet.component';
import { PonyComponent } from '../pony/pony.component';
import { RaceModel } from '../models/race.model';
import { PonyModel } from '../models/pony.model';

describe('BetComponent', () => {
  const fakeRaceService = jasmine.createSpyObj('RaceService', ['get', 'bet', 'cancelBet']);
  const race = { id: 1, name: 'Paris' } as RaceModel;
  fakeRaceService.get.and.returnValue(of(race));
  const fakeActivatedRoute = { snapshot: { paramMap: convertToParamMap({ raceId: 1 }) } };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule],
    providers: [
      { provide: RaceService, useValue: fakeRaceService },
      { provide: ActivatedRoute, useValue: fakeActivatedRoute }
    ]
  }));

  it('should display a race name, its date and its ponies', () => {
    const fixture = TestBed.createComponent(BetComponent);
    fixture.detectChanges();

    // given a race in Paris with 5 ponies
    const betComponent = fixture.componentInstance;
    betComponent.raceModel = {
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
    const directives = fixture.debugElement.queryAll(By.directive(PonyComponent));
    expect(directives).not.toBeNull('You should use the PonyComponent in your template to display the ponies');
    expect(directives.length).toBe(5, 'You should have five pony components in your template');
    const element = fixture.nativeElement;
    const raceName = element.querySelector('h2');
    expect(raceName).not.toBeNull('You need an h2 element for the race name');
    expect(raceName.textContent).toContain('Paris', 'The h2 element should contain the race name');
    const startInstant = element.querySelector('p');
    expect(startInstant).not.toBeNull('You should use a `p` element to display the start instant');
    expect(startInstant.textContent).toContain('ago', 'You should use the `fromNow` pipe you created to format the start instant');
  });

  it('should trigger a bet when a pony is clicked', async(() => {
    const fixture = TestBed.createComponent(BetComponent);
    fixture.detectChanges();

    fakeRaceService.bet.and.returnValue(of({
      id: 12,
      name: 'Paris',
      ponies: [
        { id: 1, name: 'Gentle Pie', color: 'YELLOW' },
        { id: 2, name: 'Big Soda', color: 'ORANGE' }
      ],
      startInstant: '2016-02-18T08:02:00Z',
      betPonyId: 1
    }));

    // given a race in Paris with 5 ponies
    const betComponent = fixture.componentInstance;
    betComponent.raceModel = {
      id: 12,
      name: 'Paris',
      ponies: [
        { id: 1, name: 'Gentle Pie', color: 'YELLOW' },
        { id: 2, name: 'Big Soda', color: 'ORANGE' }
      ],
      startInstant: '2016-02-18T08:02:00Z'
    };
    fixture.detectChanges();

    // when we emit a `ponyClicked` event
    const directives = fixture.debugElement.queryAll(By.directive(PonyComponent));
    const gentlePie = directives[0].componentInstance;

    // then we should have placed a bet on the pony
    gentlePie.ponyClicked.subscribe(() => {
      expect(fakeRaceService.bet).toHaveBeenCalledWith(12, 1);
      expect(betComponent.raceModel.betPonyId).toBe(1, 'You must store the response of the bet in the field `raceModel`');
    });

    gentlePie.ponyClicked.emit(betComponent.raceModel.ponies[0]);
  }));

  it('should test if the pony is the one we bet on', () => {
    const fixture = TestBed.createComponent(BetComponent);
    const component = fixture.componentInstance;
    component.raceModel = {
      id: 12,
      name: 'Paris',
      ponies: [
        { id: 1, name: 'Gentle Pie', color: 'YELLOW' },
        { id: 2, name: 'Big Soda', color: 'ORANGE' }
      ],
      startInstant: '2016-02-18T08:02:00Z',
      betPonyId: 1
    };
    const pony = { id: 1 } as PonyModel;

    const isSelected = component.isPonySelected(pony);

    expect(isSelected).toBe(true, 'The `isPonySelected` method should return true if the pony is selected');
  });

  it('should initialize the race with ngOnInit', () => {
    const fixture = TestBed.createComponent(BetComponent);
    const component = fixture.componentInstance;
    expect(component.raceModel).toBeUndefined();

    fakeActivatedRoute.snapshot.paramMap = convertToParamMap({ raceId: 1 });
    component.ngOnInit();

    expect(component.raceModel).toBe(race, '`ngOnInit` should initialize the `raceModel`');
    expect(fakeRaceService.get).toHaveBeenCalledWith(1);
  });

  it('should display an error message if bet failed', () => {
    const fixture = TestBed.createComponent(BetComponent);
    fakeRaceService.bet.and.callFake(() => throwError(new Error('Oops')));

    const component = fixture.componentInstance;
    component.raceModel = { id: 2 } as RaceModel;
    expect(component.betFailed).toBe(false);

    const pony = { id: 1 } as PonyModel;
    component.betOnPony(pony);

    expect(component.betFailed).toBe(true);

    fixture.detectChanges();

    const element = fixture.nativeElement;
    const message = element.querySelector('.alert.alert-danger');
    expect(message.textContent).toContain('The race is already started or finished');
  });

  it('should cancel a bet', () => {
    const fixture = TestBed.createComponent(BetComponent);
    fakeRaceService.cancelBet.and.returnValue(of(null));

    const component = fixture.componentInstance;
    component.raceModel = { id: 2, betPonyId: 1, name: 'Lyon', ponies: [], startInstant: '2016-02-18T08:02:00Z' };

    const pony = { id: 1 } as PonyModel;
    component.betOnPony(pony);

    expect(fakeRaceService.cancelBet).toHaveBeenCalledWith(2);
    expect(component.raceModel.betPonyId).toBeFalsy();
  });

  it('should display a message if canceling a bet fails', () => {
    const fixture = TestBed.createComponent(BetComponent);
    fixture.detectChanges();

    fakeRaceService.cancelBet.and.callFake(() => throwError(new Error('Oops')));

    const component = fixture.componentInstance;
    component.raceModel = { id: 2, betPonyId: 1, name: 'Lyon', ponies: [], startInstant: '2016-02-18T08:02:00Z' };
    expect(component.betFailed).toBe(false);

    const pony = { id: 1 } as PonyModel;
    component.betOnPony(pony);

    expect(fakeRaceService.cancelBet).toHaveBeenCalledWith(2);
    expect(component.raceModel.betPonyId).toBe(1);
    expect(component.betFailed).toBe(true);
  });

  it('should display a link to go to live', () => {
    const fixture = TestBed.createComponent(BetComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.raceModel = { id: 2, betPonyId: 1, name: 'Lyon', ponies: [], startInstant: '2016-02-18T08:02:00Z' };
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const button = element.querySelector('a[href="/races/2/live"]');
    expect(button).not.toBeNull('You should have a link to go to the live with an href `/races/id/live`');
    expect(button.textContent).toContain('Watch live!');
  });
});
