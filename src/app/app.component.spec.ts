import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule]
  }));

  it('should have a title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const element = fixture.nativeElement;
    const routerOutlet = element.querySelector('router-outlet');
    expect(routerOutlet).not.toBeNull('You need a RouterOutlet component in your root component');
  });
});
