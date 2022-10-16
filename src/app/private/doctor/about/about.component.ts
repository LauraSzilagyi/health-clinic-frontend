import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../../api.service";
import {Doctor} from "../../../models/doctor";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  doctorId!: number;
  doctor: Doctor = new Doctor();
  imageSrc!: string | ArrayBuffer | null;

  constructor(private activatedRoute: ActivatedRoute,
              private apiService: ApiService) { }

  ngOnInit(): void {
    this.getDoctor()
  }

  getDoctor() {
    this.getDoctorIdFromPath();
    this.getDoctorNameById(this.doctorId);
  }

  readURL(event: Event): void {
    console.log('image changed')
    // @ts-ignore
    if (event.target.files && event.target.files[0]) {
      // @ts-ignore
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => {
        this.imageSrc = reader.result;
        this.apiService.updateDoctorImage(this.doctorId, this.imageSrc).subscribe();
      }

      reader.readAsDataURL(file);
    }
  }

  private getDoctorIdFromPath() {
    this.activatedRoute.url.subscribe(s => {
      this.doctorId = Number(s[1])
    })
  }

  getDoctorNameById(doctorId: number) {
    this.apiService.getDoctorById(doctorId)
      .subscribe(value => {
        this.doctor = value
      })
  }

}
