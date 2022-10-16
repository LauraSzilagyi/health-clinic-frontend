import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {AppointmentPageComponent} from "./appointment-page/appointment-page.component";
import {ContactComponent} from "./contact/contact.component";
import {AdminComponent} from "./private/admin/admin.component";
import {ShowUsersComponent} from "./private/admin/show-users/show-users.component";
import {AddUserComponent} from "./private/admin/user/add-user.component";
import {DoctorComponent} from "./private/doctor/doctor.component";
import {AboutComponent} from "./private/doctor/about/about.component";
import {DoctorAppointmentsComponent} from "./private/doctor/doctor-appointments/doctor-appointments.component";
import {AuthenticatedGuard} from "./authenticated-guard";


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login/:page', component: LoginComponent},
  {path: 'home.html', component: HomeComponent},
  {path: 'contact.html', component: ContactComponent},
  {path: 'appointment.html', component: AppointmentPageComponent},
  {path: 'show-users.html', component: ShowUsersComponent, pathMatch: "prefix", canActivate: [AuthenticatedGuard]},
  {path: 'user.html', component: AddUserComponent, canActivate: [AuthenticatedGuard]},
  {path: 'user.html/:id', component: AddUserComponent, canActivate: [AuthenticatedGuard]},
  {path: 'admin.html', component: AdminComponent, canActivate: [AuthenticatedGuard]},
  {path: 'doctor.html/:id', component: DoctorComponent, canActivate: [AuthenticatedGuard]},
  {path: 'doctor-about.html/:id', component: AboutComponent, canActivate: [AuthenticatedGuard]},
  {path: 'doctor-appointments.html/:id', component: DoctorAppointmentsComponent, canActivate: [AuthenticatedGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
