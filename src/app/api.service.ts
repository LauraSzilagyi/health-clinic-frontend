import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../environments/environment";
import {Doctor} from "./models/doctor";
import {AvailabilityModel} from "./models/doctor/availability-model";
import {AddAppointment} from "./models/add-appointment";
import {AppointmentDay} from "./models/doctor/appointment-day";
import {DoctorAvailability} from "./models/doctor-availability";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) {
  }

  getDoctors(): Observable<Doctor[]> {
    return this.httpClient.get<Doctor[]>(`${environment.api_url}/doctors`);
  }

  getDepartments(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${environment.api_url}/doctors/departments`);
  }

  getDoctorsByDepartment(department: string): Observable<Doctor[]> {
    return this.httpClient.get<Doctor[]>(`${environment.api_url}/doctors/departments/${department}`);
  }

  getDoctorAvailabilityByDoctorId(doctorId: number): Observable<AvailabilityModel[]> {
    return this.httpClient.get<AvailabilityModel[]>(`${environment.api_url}/doctors/${doctorId}/availability`);
  }

  addAppointment(appointment: AddAppointment): Observable<any> {
    return this.httpClient.post<any>(`${environment.api_url}/appointment`, appointment);
  }

  getDoctorById(doctorId: number): Observable<Doctor> {
    return this.httpClient.get<Doctor>(`${environment.api_url}/doctors/${doctorId}`)
  }

  getDoctorAppointmentsByDoctorId(doctorId: number): Observable<AppointmentDay[]> {
    return this.httpClient.get<AppointmentDay[]>(`${environment.api_url}/doctors/${doctorId}/appointments`)
  }

  deleteDoctorById(doctorId: number): Observable<any> {
    return this.httpClient.delete(`${environment.api_url}/doctors/${doctorId}`)
  }

  updateDoctorImage(doctorId: number, image:any): Observable<any> {
    return this.httpClient.patch(`${environment.api_url}/doctors/${doctorId}/image`, {"image": image})
  }

  updateDoctorById(doctorId: number, doctor: Doctor): Observable<any> {
    return this.httpClient.patch(`${environment.api_url}/doctors/${doctorId}`, doctor)
  }

  addDoctor(doctor: Doctor): Observable<any> {
    return this.httpClient.post(`${environment.api_url}/doctors`, doctor)
  }

  addDoctorAvailabilities(doctorId: number, availability: DoctorAvailability[]): Observable<any> {
    return this.httpClient.post(`${environment.api_url}/doctors/${doctorId}/availability`, availability)
  }
}
