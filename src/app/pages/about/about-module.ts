import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing-module';
import { About } from './about';

@NgModule({
  declarations: [About],
  imports: [CommonModule, AboutRoutingModule],
})
export class AboutModule {}
