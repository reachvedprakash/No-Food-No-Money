import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationResultsPage } from './location-results.page';

const routes: Routes = [
  {
    path: '',
    component: LocationResultsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationResultsPageRoutingModule {}
