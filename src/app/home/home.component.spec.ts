import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';

import { AppModule } from '../app.module';
import { HomeComponent } from './home.component';
import { UserModel } from '../models/user.model';
import { UserService } from '../user.service';

describe('HomeComponent', () => {

  const fakeUserService = { userEvents: new BehaviorSubject<UserModel>(undefined) } as UserService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule]
  }));

  it('display the title and quote', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const element = fixture.nativeElement;

    const title = element.querySelector('h1');
    expect(title).not.toBeNull('You should have an `h1` element to display the title');
    expect(title.textContent).toContain('Ponyracer');
    expect(title.textContent)
      .toContain('Always a pleasure to bet on ponies', 'You should have the `small` element inside the `h1` element');

    const subtitle = element.querySelector('small');
    expect(subtitle).not.toBeNull('You should have a `small` element to display the subtitle');
    expect(subtitle.textContent).toContain('Always a pleasure to bet on ponies');
  });

  it('display a link to go the login and another to register', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const element = fixture.nativeElement;
    fixture.detectChanges();

    fixture.componentInstance.user = null;
    fixture.detectChanges();

    const button = element.querySelector('a[href="/login"]');
    expect(button).not.toBeNull('You should have an `a` element to display the link to the login. Maybe you forgot to use `routerLink`?');
    expect(button.textContent).toContain('Login', 'The link should have a text');

    const buttonRegister = element.querySelector('a[href="/register"]');
    expect(buttonRegister)
      .not.toBeNull('You should have an `a` element to display the link to the register page. Maybe you forgot to use `routerLink`?');
    expect(buttonRegister.textContent).toContain('Register', 'The link should have a text');
  });

  it('should listen to userEvents in ngOnInit', async(() => {
    const component = new HomeComponent(fakeUserService);
    component.ngOnInit();

    const user = { login: 'cedric', money: 200 } as UserModel;

    fakeUserService.userEvents.next(user);

    fakeUserService.userEvents.subscribe(() => {
      expect(component.user).toBe(user, 'Your component should listen to the `userEvents` observable');
    });
  }));

  it('should unsubscribe on destroy', () => {
    const component = new HomeComponent(fakeUserService);
    component.ngOnInit();
    spyOn(component.userEventsSubscription, 'unsubscribe');
    component.ngOnDestroy();

    expect(component.userEventsSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should display only a link to go the races page if logged in', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    fixture.componentInstance.user = { login: 'cedric' } as UserModel;
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const button = element.querySelector('a[href="/races"]');
    expect(button).not.toBeNull('The link should lead to the races if the user is logged');
    expect(button.textContent).toContain('Races', 'The first link should lead to the races if the user is logged');
  });
});
