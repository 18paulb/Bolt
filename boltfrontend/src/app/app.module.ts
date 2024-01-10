import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ReviewBuilderComponent} from './review-builder/review-builder.component';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {TemplateBrowserComponent} from './template-browser/template-browser.component';

import {DeviceFrameComponent} from './device-frame/device-frame.component';
import {AbandonedCartBuilderComponent} from './abandoned-cart-builder/abandoned-cart-builder.component';
import {SurveyBuilderComponent} from './survey-builder/survey-builder.component';

@NgModule({
  declarations: [
    AppComponent,
    ReviewBuilderComponent,
    TemplateBrowserComponent,
    DeviceFrameComponent,
    AbandonedCartBuilderComponent,
    SurveyBuilderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
