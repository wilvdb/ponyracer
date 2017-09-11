import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserService } from './user.service';

describe('UserService', () => {

  let userService: UserService;
  let http: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [UserService]
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    http = TestBed.get(HttpTestingController);
  });

  it('should register a user', () => {
    // fake response
    const user = {
      id: 1,
      login: 'cexbrayat',
      money: 1000,
      registrationInstant: '2015-12-01T11:00:00Z',
      token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.5cAW816GUAg3OWKWlsYyXI4w3fDrS5BpnmbyBjVM7lo'
    };

    let actualUser;
    userService.register(user.login, 'password', 1986).subscribe(fetchedUser => actualUser = fetchedUser);

    const req = http.expectOne({ method: 'POST', url: 'http://ponyracer.ninja-squad.com/api/users' });
    expect(req.request.body).toEqual({ login: user.login, password: 'password', birthYear: 1986 });
    req.flush(user);

    expect(actualUser).toBe(user, 'You should emit the user.');
  });
});
