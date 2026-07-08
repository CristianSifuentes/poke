import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Search } from './search';

const routes: Routes = [
  {
    path: 'search',
    component: Search
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchRoutingModule {}
