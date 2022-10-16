import {Component} from '@angular/core';
import {ScriptLoaderService} from "../../../script-loader.service";
import {ApiService} from "../../../api.service";
import {AppointmentDay} from "../../../models/doctor/appointment-day";
import {AppointmentSchedule} from "../../../models/doctor/appointment-schedule";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-doctor-appointments',
  templateUrl: './doctor-appointments.component.html',
  styleUrls: ['./doctor-appointments.component.css'],
})
export class DoctorAppointmentsComponent {

  doctorId!: number;
  appointments: AppointmentDay[] = []

  constructor(private scriptLoader: ScriptLoaderService,
              private apiService: ApiService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.getDoctorIdFromPath();
    this.getAppointments();
  }

  private loadJavaScripts() {
    this.scriptLoader.load('doctor-appointments', 'main2').then(data => {
    }).catch(error => console.log(error));
  }

  private getAppointments() {
    this.apiService.getDoctorAppointmentsByDoctorId(this.doctorId)
      .subscribe(value => {
        this.appointments = value;
        this.loadJavaScripts();
      });
  }

  private getDoctorIdFromPath() {
    this.activatedRoute.url.subscribe(s => {
      this.doctorId = Number(s[1])
    })
  }
}
