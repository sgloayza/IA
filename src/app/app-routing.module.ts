import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './principal/principal.component';
import { EstudianteComponent } from './estudiante/estudiante.component';
import { StaffComponent } from './staff/staff.component';

const routes: Routes = [
  { path: "principal", component: PrincipalComponent, canActivate : []},
  { path: "estudiante", component: EstudianteComponent, canActivate : []},
  { path: "staff", component: StaffComponent, canActivate : []},
  { path: "**", redirectTo: "principal" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
