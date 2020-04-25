import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThankPage } from './thank.page';

const routes: Routes = [
  {
    path: '',
    component: ThankPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThankPageRoutingModule {}
