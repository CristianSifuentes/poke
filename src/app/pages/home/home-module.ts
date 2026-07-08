import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing-module';
import { Home } from './home';
import { HomeDetail } from './home-detail/home-detail';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [Home, HomeDetail],
  imports: [CommonModule, HomeRoutingModule, SharedModule],
})
export class HomeModule {}
