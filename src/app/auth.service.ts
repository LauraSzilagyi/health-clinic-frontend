import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../environments/environment";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient,
              private router: Router) {
  }

  login(email: string, password: string, redirect_url: string, isAdmin: boolean = false): any {

    let params = new HttpParams();
    params = params.append('email', email);
    params = params.append('password', password);
    params = params.append('isAdmin', isAdmin);

    this.httpClient.get<any>(`${environment.api_url}/login`, {
      params
    }).subscribe(value => {
      if (value.message.toLowerCase() == 'success') {
        localStorage.setItem('token', value.token);
        redirect_url = redirect_url == 'admin.html' ? redirect_url : redirect_url + "/" + value.userId;
        this.router.navigateByUrl(redirect_url).then();
      }
    })
  }
}
