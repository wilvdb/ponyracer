import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { AppModule } from '../app.module';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule]
  }));

  it('should call the register method on submit', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    spyOn(fixture.componentInstance, 'register');

    fixture.detectChanges();
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', {});

    expect(fixture.componentInstance.register).toHaveBeenCalled();
    expect((fixture.componentInstance.register as jasmine.Spy).calls.count())
      .toEqual(1, 'Looks like you are calling register several times!');
  });

  it('should display a form to register', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();

    // given a form
    const userForm = fixture.componentInstance.userForm;

    expect(userForm.valid).toBe(false);
    expect(userForm.get('login')).not.toBeNull('Your form should have a `login` field');
    expect(userForm.get('login').getError('required')).toBe(true, 'The `login` field should be required');
    expect(userForm.get('password')).not.toBeNull('Your form should have a `password` field');
    expect(userForm.get('password').getError('required')).toBe(true, 'The `password` field should be required');
    expect(userForm.get('birthYear')).not.toBeNull('Your form should have a `birthYear` field');
    userForm.get('birthYear').setValue('');
    fixture.detectChanges();
    expect(userForm.get('birthYear').getError('required')).toBe(true, 'The `birthYear` field should be required');

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

    fixture.detectChanges();

    // then we should have a valid form, with no error
    expect(userForm.valid).toBe(true);
    expect(button.getAttribute('disabled')).toBeNull('Your submit button should not be disabled if the form is invalid');
    expect(userForm.value).toEqual({ 'login': 'Cédric', 'password': 'password', 'birthYear': 1986 });
    expect(userForm.get('login').getError('required')).toBe(null);
    expect(userForm.get('password').getError('required')).toBe(null);
    expect(userForm.get('birthYear').getError('required')).toBe(null);
  });

});
