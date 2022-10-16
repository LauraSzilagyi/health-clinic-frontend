import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {

  private token = localStorage.getItem('token');

  constructor(
    private router: Router,
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.token) {
      return true;
    } else {
      this.router.navigate([`login/${next.routeConfig?.path?.replace("/:id", "")}`]);
      return false;
    }
  }
}
