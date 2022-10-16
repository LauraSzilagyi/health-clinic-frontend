import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {AppRoutingModule} from './app-routing.module';
import {HomeComponent} from './home/home.component';
import {MenuComponent} from './menu/menu.component';
import {FooterComponent} from './footer/footer.component';
import {AppointmentComponent} from './appointment/appointment.component';
import {AppointmentPageComponent} from './appointment-page/appointment-page.component';
import {ContactComponent} from './contact/contact.component';
import {AdminComponent} from './private/admin/admin.component';
import {ShowUsersComponent} from './private/admin/show-users/show-users.component';
import {AddUserComponent} from './private/admin/user/add-user.component';
import {AdminSidebarComponent} from './private/admin/admin-sidebar/admin-sidebar.component';
import {DoctorComponent} from './private/doctor/doctor.component';
import {DoctorSidebarComponent} from './private/doctor/doctor-sidebar/doctor-sidebar.component';
import {AboutComponent} from './private/doctor/about/about.component';
import {DoctorAppointmentsComponent} from './private/doctor/doctor-appointments/doctor-appointments.component';
import {ScriptLoaderService} from "./script-loader.service";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MenuComponent,
    FooterComponent,
    AppointmentComponent,
    AppointmentPageComponent,
    ContactComponent,
    AdminComponent,
    ShowUsersComponent,
    AddUserComponent,
    AdminSidebarComponent,
    DoctorComponent,
    DoctorSidebarComponent,
    AboutComponent,
    DoctorAppointmentsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    ScriptLoaderService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
