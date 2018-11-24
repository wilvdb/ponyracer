import { async, TestBed } from '@angular/core/testing';

import { WEBSOCKET, WEBSTOMP } from './app.tokens';
import { WsService } from './ws.service';

describe('WsService', () => {

  let wsService: WsService;
  const webstomp = jasmine.createSpyObj('Webstomp', ['over', 'connect', 'subscribe']);
  class FakeWebSocket { close() {}}

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WsService,
        { provide: WEBSOCKET, useValue: FakeWebSocket },
        { provide: WEBSTOMP, useValue: webstomp }
      ]
    });
  });

  beforeEach(() => wsService = TestBed.get(WsService));

  it('should connect to a websocket channel', async(() => {
    // given a fake WebSocket connection
    webstomp.over.and.returnValue(webstomp);
    webstomp.connect.and.callFake((headers: { [key: string]: string }, callback: Function) => callback());
    webstomp.subscribe.and.callFake((channel: string, callback: Function) => {
      expect(channel).toBe('/channel/2');
      callback({ body: '{"id": "1"}' });
    });

    // when connecting to a channel
    const messages = wsService.connect<{ id: string }>('/channel/2');

    messages.subscribe(message => {
      expect(message.id).toBe('1');
    });

    // then we should have a WebSocket connection with Stomp protocol
    expect(webstomp.over).toHaveBeenCalled();
  }));

  it('should throw on error if the connection fails', async(() => {
    // given a fake WebSocket connection
    webstomp.over.and.returnValue(webstomp);

    // when connecting to a channel
    const messages = wsService.connect('/channel/2');
    // with a failed connection
    webstomp.connect.and.callFake(
      (headers: { [key: string]: string }, callback: Function, errorCallback: Function) => errorCallback(new Error('Oops!'))
    );

    // then we should have an error in the observable
    messages.subscribe(
      message => fail(),
      error => {
        expect(error.message).toBe('Oops!');
      }
    );
  }));

  it('should unsubscribe from the websocket connection on unsubscription', async(() => {
    // given a fake WebSocket connection
    webstomp.over.and.returnValue(webstomp);
    // returning a subscription
    webstomp.connect.and.callFake((headers: { [key: string]: string }, callback: Function) => callback());
    const fakeSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    webstomp.subscribe.and.returnValue(fakeSubscription);

    // when connecting to a channel
    const messages = wsService.connect('/channel/2');

    // and unsubscribing
    const subscription = messages.subscribe(() => {
    });
    subscription.unsubscribe();

    // then we should have unsubscribe from the Websocket connection
    expect(fakeSubscription.unsubscribe).toHaveBeenCalled();
  }));
});
