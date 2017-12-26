import { InjectionToken } from '@angular/core';

export const WEBSOCKET = new InjectionToken<WebSocket>('WebSocket');
export const WEBSTOMP = new InjectionToken<any>('Webstomp');
