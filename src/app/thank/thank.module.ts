import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ThankPageRoutingModule } from './thank-routing.module';

import { ThankPage } from './thank.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ThankPageRoutingModule
  ],
  declarations: [ThankPage]
})
export class ThankPageModule {}
