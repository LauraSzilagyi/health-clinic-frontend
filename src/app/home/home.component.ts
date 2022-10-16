import {Component, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import {Doctor} from "../models/doctor";
import {ScriptLoaderService} from "../script-loader.service";

declare var jQuery: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  page: string = "home-menu";

  doctors: Doctor[] = []

  constructor(private apiService: ApiService,
              private scriptLoader: ScriptLoaderService) {
  }

  ngOnInit(): void {
    this.scriptLoader.load('carousel').finally(() => {
      this.initCarousel()
    })
  }

  ngAfterViewInit() {
    this.getDoctors();
  }

  private getDoctors() {
    this.apiService.getDoctors()
      .subscribe((data: Doctor[]) => {
        this.doctors = data;
      });
  }

  private initCarousel() {
    (function ($) {
      $(document).ready(function () {
        $('.owl-carousel').owlCarousel({
          nav: true,
          navText: ["<i class='bi bi-arrow-left'></i>", "<i class='bi bi-arrow-right'></i>"],
          items: 2,
          loop: true,
          center: false,
          margin: 50,
          lazyLoad: false,
        });
      });
    })(jQuery);
  }
}
