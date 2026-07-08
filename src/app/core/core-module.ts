import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Header } from './components/header/header';

@NgModule({
  declarations: [Header],
  imports: [CommonModule, RouterModule],
  exports: [
    Header
  ]
})
export class CoreModule {}
