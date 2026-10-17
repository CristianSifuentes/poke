import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing-module';
import { Home } from './home';
import { HomeCard } from './components/home-card/home-card';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [Home, HomeCard],
  imports: [CommonModule, HomeRoutingModule, SharedModule],
})
export class HomeModule {}
