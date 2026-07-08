import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { App } from './app';
import { CoreModule } from './core/core-module';
import { AppRoutingModule } from './app-routing-module';
import { HomeModule } from './pages/home/home-module';
import { SearchModule } from './pages/search/search-module';

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,

    //own modules
    CoreModule,

    //no home routing module because it is lazy loaded
    HomeModule,
    SearchModule,

    
    AppRoutingModule,
  ],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
