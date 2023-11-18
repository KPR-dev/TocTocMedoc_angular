import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { TarifRoutingModule } from './tarif-routing.module';
import {TarifComponent} from './tarif.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'grille-tarifaire', component: TarifComponent },

];


@NgModule({
  declarations: [
    TarifComponent
  ],
  imports: [
    BrowserModule,
    TarifRoutingModule,

    FormsModule,
    ReactiveFormsModule,

    HttpClientModule,

    BrowserAnimationsModule,

    [RouterModule.forRoot(routes)]
  ],
  providers: [],
  bootstrap: [TarifComponent]
})
export class TarifModule { }
