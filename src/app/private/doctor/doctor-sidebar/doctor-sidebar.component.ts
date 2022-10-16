import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ScriptLoaderService} from "../../../script-loader.service";
import {ApiService} from "../../../api.service";

@Component({
  selector: 'app-doctor-sidebar',
  templateUrl: './doctor-sidebar.component.html',
  styleUrls: ['./doctor-sidebar.component.css']
})
export class DoctorSidebarComponent implements OnInit {

  doctorId!: number;
  doctorName!: string;

  constructor(private router: Router,
              private scriptLoader: ScriptLoaderService,
              private activatedRoute: ActivatedRoute,
              private apiService: ApiService) { }

  ngOnInit(): void {
    this.scriptLoader.load('fontawesome')
    this.getDoctorIdFromPath();

    this.getDoctorNameById(this.doctorId)
  }

  private getDoctorIdFromPath() {
    this.activatedRoute.url.subscribe(s => {
      this.doctorId = Number(s[1])
    })
  }

  getDoctorNameById(doctorId: number) {
    this.apiService.getDoctorById(doctorId)
      .subscribe(value => {
        this.doctorName = value.name
      })
  }

  logout() {
    localStorage.setItem('token', '');
    this.router.navigateByUrl('login/doctor.html')
  }

}
