import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from '../environments/environment';
import { WEBSOCKET, WEBSTOMP } from './app.tokens';

@Injectable()
export class WsService {

  constructor(@Inject(WEBSOCKET) private WebSocket, @Inject(WEBSTOMP) private Webstomp) { }

  connect(channel): Observable<any> {
    return Observable.create(observer => {
      const connection = new this.WebSocket(`${environment.wsBaseUrl}/ws`);
      const stompClient = this.Webstomp.over(connection);
      let subscription;
      stompClient.connect({ login: null, passcode: null }, () => {
        subscription = stompClient.subscribe(channel, message => {
          const bodyAsJson = JSON.parse(message.body);
          observer.next(bodyAsJson);
        });
      }, error => observer.error(error));
      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
        connection.close();
      };
    });
  }
}
