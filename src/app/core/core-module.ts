import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Header } from './components/header/header';
import { ToastOutlet } from './components/toast-outlet/toast-outlet';

@NgModule({
  declarations: [Header, ToastOutlet],
  imports: [CommonModule, RouterModule],
  exports: [Header, ToastOutlet],
})
export class CoreModule {}
