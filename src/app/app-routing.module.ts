import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GraphicsComponent } from './graphics/graphics.component';

const routes: Routes = [
  {path:'home', component:HomeComponent},
  {path:'graphic/weekly', component:GraphicsComponent},
  {path:'**',component:HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
