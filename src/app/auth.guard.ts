import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  permission = false;


  canActivate() {
    return this.permission;
  }

  changePermissionTrue() {
    this.permission = true;
    console.log(this.permission) 
  }

  changePermissionFalse() {
    this.permission = false;
  }
  
}
