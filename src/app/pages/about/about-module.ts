import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing-module';
import { About } from './about';
import { AboutHero } from './components/about-hero/about-hero';
import { StatGrid } from './components/stat-grid/stat-grid';
import { TypeGallery } from './components/type-gallery/type-gallery';
import { RegionTimeline } from './components/region-timeline/region-timeline';
import { ArchitectureMap } from './components/architecture-map/architecture-map';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [About, AboutHero, StatGrid, TypeGallery, RegionTimeline, ArchitectureMap],
  imports: [CommonModule, AboutRoutingModule, SharedModule],
})
export class AboutModule {}
