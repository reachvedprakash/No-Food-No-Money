import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationResultsPageRoutingModule } from './location-results-routing.module';

import { LocationResultsPage } from './location-results.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationResultsPageRoutingModule
  ],
  declarations: [LocationResultsPage]
})
export class LocationResultsPageModule {}
