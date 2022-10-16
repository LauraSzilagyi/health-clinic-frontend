import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../api.service";
import {Doctor} from "../../../models/doctor";

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.css']
})
export class ShowUsersComponent implements OnInit {

  doctors!: Doctor[];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getDoctors()
  }

  private getDoctors() {
    this.apiService.getDoctors()
      .subscribe(value => {
        this.doctors = value;
      })
  }

  deleteDoctor(doctorId: number) {
    let toBeDeleted = confirm("Are you sure you want to delete this doctor?!")
    if (toBeDeleted) {
      console.log("DELETE DOCTOR: " + doctorId)
      this.apiService.deleteDoctorById(doctorId)
        .subscribe(value => {
          this.getDoctors();
        })
    }
  }
}
