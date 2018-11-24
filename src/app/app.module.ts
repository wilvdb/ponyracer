import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { ROUTES } from './app.routes';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { RacesComponent } from './races/races.component';
import { RaceComponent } from './race/race.component';
import { PonyComponent } from './pony/pony.component';
import { FromNowPipe } from './from-now.pipe';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { JwtInterceptorService } from './jwt-interceptor.service';
import { BetComponent } from './bet/bet.component';
import { LiveComponent } from './live/live.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    RacesComponent,
    RaceComponent,
    PonyComponent,
    FromNowPipe,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    BetComponent,
    LiveComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useExisting: JwtInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
