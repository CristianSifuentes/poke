import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Header } from './components/header/header';
import { ScrollTop } from './components/scroll-top/scroll-top';
import { ThemeToggle } from './components/theme-toggle/theme-toggle';
import { ToastOutlet } from './components/toast-outlet/toast-outlet';

@NgModule({
  declarations: [Header, ToastOutlet, ThemeToggle, ScrollTop],
  imports: [CommonModule, RouterModule],
  exports: [Header, ToastOutlet, ScrollTop],
})
export class CoreModule {}
