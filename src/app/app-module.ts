import { NgModule, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { App } from './app';
import { CoreModule } from './core/core-module';
import { AppRoutingModule } from './app-routing-module';
import { NavigationFocus } from './core/routing/navigation-focus';

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,

    //own modules
    CoreModule,

    // feature modules are lazy-loaded via loadChildren in AppRoutingModule —
    // importing them here too would double-register their routes
    AppRoutingModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideAppInitializer(() => inject(NavigationFocus).init()),
  ],
  bootstrap: [App],
})
export class AppModule {}
