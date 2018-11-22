import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule]
  }));

  it('should have a router outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const element = fixture.nativeElement;
    const routerOutlet = element.querySelector('router-outlet');
    expect(routerOutlet).not.toBeNull('You need a RouterOutlet component in your root component');
  });

  it('should use the menu component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const element = fixture.debugElement;
    expect(element.query(By.directive(MenuComponent)))
      .not.toBeNull('You probably forgot to add MenuComponent to the AppComponent template');
  });
});
