import { Inject, Injectable, Type } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Client, Subscription} from 'webstomp-client';

import { environment } from '../environments/environment';
import { WEBSOCKET, WEBSTOMP } from './app.tokens';


@Injectable({
  providedIn: 'root'
})
export class WsService {

  constructor(@Inject(WEBSOCKET) private WebSocket: Type<WebSocket>, @Inject(WEBSTOMP) private Webstomp: any) { }

  connect<T>(channel: string): Observable<T> {
    return Observable.create((observer: Observer<T>) => {
      const connection: WebSocket = new this.WebSocket(`${environment.wsBaseUrl}/ws`);
      const stompClient: Client = this.Webstomp.over(connection);
      let subscription: Subscription;
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
