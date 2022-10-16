import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ScriptLoaderService} from "../../../script-loader.service";

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {

  constructor(private router: Router,
              private scriptLoader: ScriptLoaderService) { }

  ngOnInit(): void {
    this.scriptLoader.load('fontawesome')
  }

  logout() {
    localStorage.setItem('token', '');
    this.router.navigateByUrl('login/admin.html')
  }

}
