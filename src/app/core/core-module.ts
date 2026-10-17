import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Header } from './components/header/header';
import { ToastOutlet } from './components/toast-outlet/toast-outlet';
import { CustomPipePipe } from './pipes/custom-pipe-pipe';

@NgModule({
  declarations: [Header, ToastOutlet, CustomPipePipe],
  imports: [CommonModule, RouterModule],
  exports: [Header, ToastOutlet],
})
export class CoreModule {}
