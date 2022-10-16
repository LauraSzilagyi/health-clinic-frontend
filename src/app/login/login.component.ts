import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private auth: AuthService) {
  }

  ngOnInit(): void {
  }

  logIn() {
    let email = (document.getElementById('login') as HTMLInputElement),
      password = (document.getElementById('password') as HTMLInputElement);
    let urlToRedirect = "";
    this.activatedRoute.url.subscribe(value => {
      urlToRedirect = value[1].path;
    })
    let isAdmin = urlToRedirect == 'admin.html';

    this.auth.login(email.value, password.value, urlToRedirect, isAdmin);
  }
}
