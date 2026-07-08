import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home';
import { HomeDetail } from './home-detail/home-detail';

const routes: Routes = [
  {
    path: 'home',
    component: Home,
    children: [
      {
        path: 'detail',
        component: 
        HomeDetail
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
