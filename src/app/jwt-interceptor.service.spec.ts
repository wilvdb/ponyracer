import { HttpHandler, HttpRequest } from '@angular/common/http';

import { JwtInterceptorService } from './jwt-interceptor.service';

describe('JwtInterceptorService', () => {

  it('should do nothing if no jwt token', () => {
    const jwtService = new JwtInterceptorService();
    const req = new HttpRequest('GET', '/');
    const next = jasmine.createSpyObj('HttpHandler', ['handle']) as HttpHandler;

    jwtService.intercept(req, next);

    const nextReq = (next.handle as jasmine.Spy).calls.argsFor(0)[0] as HttpRequest<any>;
    expect(nextReq.headers.get('Authorization')).toBeNull();
  });

  it('should set a jwt token', () => {
    const jwtService = new JwtInterceptorService();
    const req = new HttpRequest('GET', '/');
    const next = jasmine.createSpyObj('HttpHandler', ['handle']) as HttpHandler;

    jwtService.setJwtToken('hello');

    jwtService.intercept(req, next);

    const nextReq = (next.handle as jasmine.Spy).calls.argsFor(0)[0] as HttpRequest<any>;
    expect(nextReq.headers.get('Authorization')).toBe('Bearer hello');
  });

  it('should remove a jwt token', () => {
    const jwtService = new JwtInterceptorService();
    const req = new HttpRequest('GET', '/');
    const next = jasmine.createSpyObj('HttpHandler', ['handle']) as HttpHandler;

    jwtService.setJwtToken('hello');

    jwtService.removeJwtToken();

    jwtService.intercept(req, next);

    const nextReq = (next.handle as jasmine.Spy).calls.argsFor(0)[0] as HttpRequest<any>;
    expect(nextReq.headers.get('Authorization')).toBeNull();
  });
});
