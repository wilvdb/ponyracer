import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from '../app.module';
import { PonyComponent } from './pony.component';
import { PonyModel } from '../models/pony.model';

describe('PonyComponent', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule]
  }));

  it('should have method to get the image URL', () => {
    // given a pony component with a PURPLE pony
    const ponyComponent: PonyComponent = new PonyComponent();
    ponyComponent.ponyModel = { id: 1, name: 'Fast Rainbow', color: 'PURPLE' };

    // when we call the method for the URL
    const url = ponyComponent.getPonyImageUrl();

    // then we should have a nice URL
    expect(url).toBe('assets/images/pony-purple.gif', 'The URL built with `getPonyImageUrl` is not correct');
  });

  it('should display an image and a legend', () => {
    const fixture = TestBed.createComponent(PonyComponent);

    // given a pony component with a PURPLE pony
    const ponyComponent: PonyComponent = fixture.componentInstance;
    ponyComponent.ponyModel = { id: 1, name: 'Fast Rainbow', color: 'PURPLE' };

    // when we trigger the change detection
    fixture.detectChanges();

    // then we should have an image and a legend
    const element = fixture.nativeElement;
    const image = element.querySelector('img');
    expect(image).not.toBeNull('You should have an image for the pony');
    expect(image.getAttribute('src')).toBe('assets/images/pony-purple.gif', 'The `src` attribute of the image is not correct');
    expect(image.getAttribute('alt')).toBe('Fast Rainbow', 'The `alt` attribute for the image is not correct');
    const legend = element.querySelector('figcaption');
    expect(legend).not.toBeNull('You should have a `figcaption` element for the pony');
    expect(legend.textContent).toContain('Fast Rainbow', 'The `figcaption` element should display the pony\'s name');
  });

  it('should emit an event on click', async(() => {
    const fixture = TestBed.createComponent(PonyComponent);
    let ponyClickedCalled = false;

    // given a pony component with a PURPLE pony
    const ponyComponent: PonyComponent = fixture.componentInstance;
    ponyComponent.ponyModel = { id: 1, name: 'Fast Rainbow', color: 'PURPLE' };

    ponyComponent.ponyClicked.subscribe((pony: PonyModel) => {
      expect(pony).toBe(ponyComponent.ponyModel, 'The output should emit the `ponyModel` on a click');
      ponyClickedCalled = true;
    });

    // when we click on the element
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const figure = element.querySelector('figure');
    expect(figure).not.toBeNull('You should have a `figure` element for the pony');
    expect(window.getComputedStyle(figure).getPropertyValue('padding-top'))
      .toBe('3px', 'You must apply some styles to the `figure` element');
    figure.dispatchEvent(new Event('click'));
    expect(ponyClickedCalled).toBeTruthy('You may have forgot the click handler on the `figure` element');
  }));

  it('should have method to get the image URL for a running pony', () => {
    // given a pony component with a GREEN running pony
    const ponyComponent: PonyComponent = new PonyComponent();
    ponyComponent.ponyModel = { id: 1, name: 'Fast Rainbow', color: 'GREEN' };
    ponyComponent.isRunning = true;

    // when we call the method for the URL
    const url = ponyComponent.getPonyImageUrl();

    // then we should have a nice URL
    expect(url).toBe('assets/images/pony-green-running.gif');
  });

});
