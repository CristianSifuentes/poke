import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Header } from './components/header/header';
import { CustomPipePipe } from './pipes/custom-pipe-pipe';

@NgModule({
  declarations: [Header, CustomPipePipe],
  imports: [CommonModule, RouterModule],
  exports: [Header],
})
export class CoreModule {}
