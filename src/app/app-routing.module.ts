import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GraphicsComponent } from './graphics/graphics.component';
import { HighlightsComponent } from './highlights/highlights.component';

const routes: Routes = [
  {path:'home', component:HomeComponent},
  {path:'graphic/:tipo', component:GraphicsComponent},
  {path:'highlights', component:HighlightsComponent},
  {path:'**',component:HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
