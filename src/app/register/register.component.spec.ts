import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

import { AppModule } from '../app.module';
import { RegisterComponent } from './register.component';
import { UserService } from '../user.service';

describe('RegisterComponent', () => {

  const fakeUserService = jasmine.createSpyObj('UserService', ['register']);
  const fakeRouter = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule],
    providers: [
      { provide: UserService, useValue: fakeUserService },
      { provide: Router, useValue: fakeRouter }
    ]
  }));

  beforeEach(() => {
    fakeUserService.register.calls.reset();
    fakeRouter.navigate.calls.reset();
  });

  it('should call the register method on submit', () => {
    const fixture: ComponentFixture<RegisterComponent> = TestBed.createComponent(RegisterComponent);
    spyOn(fixture.componentInstance, 'register');

    fixture.detectChanges();
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', {});

    expect(fixture.componentInstance.register).toHaveBeenCalled();
    expect((fixture.componentInstance.register as jasmine.Spy).calls.count())
      .toEqual(1, 'Looks like you are calling register several times!');
  });

  it('should display a form to register', () => {
    const fixture: ComponentFixture<RegisterComponent> = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();

    // given a form
    const userForm = fixture.componentInstance.userForm;

    expect(userForm.valid).toBe(false);
    expect(userForm.get('login')).not.toBeNull('Your form should have a `login` field');
    expect(userForm.get('login').getError('required')).toBe(true, 'The `login` field should be required');
    expect(userForm.get('birthYear')).not.toBeNull('Your form should have a `birthYear` field');
    userForm.get('birthYear').setValue('');
    fixture.detectChanges();
    expect(userForm.get('birthYear').getError('required')).toBe(true, 'The `birthYear` field should be required');
    const passwordForm = fixture.componentInstance.passwordForm;
    expect(passwordForm).not.toBeNull('Your component should have a field `passwordForm`');
    expect(passwordForm.valid).toBe(false);
    expect(passwordForm.get('password')).not.toBeNull('Your password form should have a `password` field');
    expect(passwordForm.get('password').getError('required')).toBe(true, 'The `password` field should be required');
    expect(passwordForm.get('confirmPassword')).not.toBeNull('Your password form should have a `confirmPassword` field');
    expect(passwordForm.get('confirmPassword').getError('required')).toBe(true);

    fixture.detectChanges();

    // when adding values in the form
    const nativeElement = fixture.nativeElement;
    const button = nativeElement.querySelector('button');
    expect(button.getAttribute('disabled')).not.toBeNull('Your submit button should be disabled if the form is invalid');
    const login = nativeElement.querySelector('input');
    expect(login).not.toBeNull('Your template should have an input for the login');
    login.value = 'Cédric';
    login.dispatchEvent(new Event('input'));
    const password = nativeElement.querySelector('[type="password"]');
    expect(password).not.toBeNull('Your template should have a password input for the password');
    password.value = 'password';
    password.dispatchEvent(new Event('input'));
    const birthYear = nativeElement.querySelector('[type="number"]');
    expect(birthYear).not.toBeNull('Your template should have a number input for the birthYear');
    birthYear.value = 1986;
    birthYear.dispatchEvent(new Event('input'));
    const confirmPassword = nativeElement.querySelectorAll('[type="password"]')[1];
    expect(confirmPassword).not.toBeNull('Your template should have a password input for the password confirmation');
    confirmPassword.value = 'password';
    confirmPassword.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    // then we should have a valid form, with no error
    expect(userForm.valid).toBe(true);
    expect(button.getAttribute('disabled')).toBeNull('Your submit button should not be disabled if the form is invalid');
    expect(userForm.value).toEqual({
      login: 'Cédric',
      passwordForm: { password: 'password', confirmPassword: 'password' },
      birthYear: 1986
    });
    expect(userForm.get('login').getError('required')).toBe(null);
    expect(passwordForm.get('password').getError('required')).toBe(null);
    expect(passwordForm.get('confirmPassword').getError('required')).toBe(null);
    expect(userForm.get('birthYear').getError('required')).toBe(null);

  });

  it('should expect a login with 3 characters', () => {
    const fixture: ComponentFixture<RegisterComponent> = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();

    // given a form
    const userForm = fixture.componentInstance.userForm;
    expect(userForm.valid).toBe(false);
    expect(userForm.get('login').getError('required')).toBe(true);
    expect(userForm.get('login').getError('minlength')).toBeUndefined();

    fixture.detectChanges();

    // when adding a too short login
    const nativeElement = fixture.nativeElement;
    const login = nativeElement.querySelector('input');
    login.value = 'Cé';
    login.dispatchEvent(new Event('input'));

    // then the form should still be invalid
    expect(userForm.valid).toBe(false);
    expect(userForm.get('login').getError('minlength')).not.toBeUndefined('Your login field should have a minLength validator');
    expect(userForm.get('login').getError('minlength').requiredLength)
      .toBe(3, 'Your login field should have a minLength validator of 3 characters');

    // when adding a long enough login
    login.value = 'Cédric';
    login.dispatchEvent(new Event('input'));

    // then we should have a valid form, with no error
    expect(userForm.valid).toBe(false);
    expect(userForm.get('login').getError('minlength')).toBe(null);
  });

  it('should have a custom validator to check the password match', () => {
    // given a FormGroup
    const passwordFormNoMatch = new FormGroup({
      password: new FormControl('hello'),
      confirmPassword: new FormControl('hi')
    });

    // when validating the form
    const match = RegisterComponent.passwordMatch(passwordFormNoMatch);

    // then we should have an error
    expect(match.matchingError)
      .toBe(true, 'Your `passwordMatch` validator should return a `matchingError` if the passwords don\'t match');

    // when the passwords match
    const passwordForm = new FormGroup({
      password: new FormControl('hello'),
      confirmPassword: new FormControl('hello')
    });
    const matchNoError = RegisterComponent.passwordMatch(passwordForm);

    // then we should have no error
    expect(matchNoError).toBe(null, 'Your `passwordMatch` validator should return `null` if the passwords match');
  });

  it('should have a password confirmation', () => {
    const fixture: ComponentFixture<RegisterComponent> = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();

    // given a form
    const passwordForm = fixture.componentInstance.passwordForm;
    expect(passwordForm.valid).toBe(false);
    expect(passwordForm.get('password').getError('required')).toBe(true);
    expect(passwordForm.get('confirmPassword').getError('required')).toBe(true);
    expect(passwordForm.getError('matchingError')).toBe(null);

    fixture.detectChanges();

    // when adding a password without confirmation
    const nativeElement = fixture.nativeElement;
    const password = nativeElement.querySelector('[type="password"]');
    password.value = 'password';
    password.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    // then the form should still be invalid
    expect(passwordForm.valid).toBe(false);
    expect(passwordForm.get('password').getError('required')).toBe(null);
    expect(passwordForm.get('confirmPassword').getError('required')).toBe(true);
    expect(passwordForm.getError('matchingError')).toBe(true);
    // and displaying the message
    const matchingErrorMessage = nativeElement.querySelector('#password-matching-error');
    expect(matchingErrorMessage).not.toBeNull('You should have a div with the id `password-matching-error` to display the error');
    expect(matchingErrorMessage.textContent).toContain('Your password does not match', 'Your error message is not correct');

    // when adding a matching password
    const confirmPassword = nativeElement.querySelectorAll('[type="password"]')[1];
    confirmPassword.value = 'password';
    confirmPassword.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    // then we should have a valid form, with no error
    expect(passwordForm.valid).toBe(true);
    expect(passwordForm.get('password').getError('required')).toBe(null);
    expect(passwordForm.get('confirmPassword').getError('required')).toBe(null);
    // message no longer displayed
    const noMatchingErrorMessage = nativeElement.querySelector('#password-matching-error');
    expect(noMatchingErrorMessage).toBe(null, 'Your error message should disappear when there is no error');
  });

  it('should have a custom validator to check the year validity', () => {
    // given a FormControl without any value
    let birthYear = new FormControl(null);

    // when validating the form
    let error = RegisterComponent.validYear(birthYear);

    // then we should have an error
    expect(error.invalidYear).toBe(true, 'Your `validYear` validator should return an `invalidYear` error if it receives `null`');

    // given an invalid value in the past
    birthYear = new FormControl(1899);

    // when validating the form
    error = RegisterComponent.validYear(birthYear);

    // then we should have an error
    expect(error.invalidYear).toBe(true, 'Your `validYear` validator should return an `invalidYear` error if it receives `1899`');

    // given an invalid value in the future
    birthYear = new FormControl(new Date().getFullYear() + 1);

    // when validating the form
    error = RegisterComponent.validYear(birthYear);

    // then we should have an error
    expect(error.invalidYear).toBe(true, 'Your `validYear` validator should return an `invalidYear` error if it receives next year');

    // given an valid value
    birthYear = new FormControl(1982);

    // when validating the form
    error = RegisterComponent.validYear(birthYear);

    // then we should have no error
    expect(error).toBe(null, 'Your `validYear` validator should return a `null` error if it receives a valid year');
  });

  it('should call the user service to register', () => {
    const fixture: ComponentFixture<RegisterComponent> = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();

    // given a form completed
    fakeUserService.register.and.returnValue(Observable.of({ id: 1 }));
    const component = fixture.componentInstance;
    component.loginCtrl.setValue('Cédric');
    component.passwordCtrl.setValue('password');
    component.birthYearCtrl.setValue(1986);

    // when registering
    component.register();

    // then we should have called the user service
    expect(fakeUserService.register).toHaveBeenCalledWith('Cédric', 'password', 1986);
    expect(fakeRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should display an error message if registration fails', () => {
    const fixture: ComponentFixture<RegisterComponent> = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();

    // given a form completed
    fakeUserService.register.and.callFake(() => Observable.throw(new Error('Oops')));
    const component = fixture.componentInstance;
    component.loginCtrl.setValue('Cédric');
    component.passwordCtrl.setValue('password');
    component.birthYearCtrl.setValue(1986);

    // when registering
    component.register();
    fixture.detectChanges();

    // then we should have called the user service
    expect(fakeUserService.register).toHaveBeenCalledWith('Cédric', 'password', 1986);
    // and not navigate
    expect(fakeRouter.navigate).not.toHaveBeenCalled();
    expect(component.registrationFailed).toBe(true, 'You should set a field `registrationFailed` to `true` if the registration fails');
    // and display the error message
    const errorMessage = fixture.nativeElement.querySelector('#registration-error');
    expect(errorMessage)
      .not.toBeNull('You should display an error message in a div with id `registration-error` if the registration fails');
    expect(errorMessage.textContent).toContain('Try again with another login.');
  });

});
