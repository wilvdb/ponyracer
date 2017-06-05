import { TestBed } from '@angular/core/testing';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { RacesComponent } from './races/races.component';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule]
  }));

  it('should have a title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement;
    expect(element.querySelector('h1').textContent).toContain('Ponyracer');
  });

  it('should use the races component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const element = fixture.debugElement;
    expect(element.query(By.directive(RacesComponent)))
      .toBeDefined('You probably forgot to add RacesComponent to the AppComponent template');
  });
});
