import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ReviewBuilderComponent} from './review-builder/review-builder.component';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { TemplateBrowserComponent } from './template-browser/template-browser.component';
import { AbandonedCartBuilderComponent } from './abandoned-cart-builder/abandoned-cart-builder.component';

@NgModule({
  declarations: [
    AppComponent,
    ReviewBuilderComponent,
    TemplateBrowserComponent,
    AbandonedCartBuilderComponent
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
