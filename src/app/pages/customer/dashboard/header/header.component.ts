import { Component } from '@angular/core';
import {AuthService} from "../../../../shared/services/auth.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  pages = [
    { name: 'Products', href: '#' },
    { name: 'Company', href: '#' },
    { name: 'Stores', href: '#' },
  ]

  constructor(private authService: AuthService, private router: Router) {}


  setupDefaultAdminUser() : void {
    this.authService.setupDefaultAdminUser();
  }

  isLogged() {
    const user = this.authService.getCurrentUser();
    return user && user.role === 'customer';
  }

  logout() {
    Swal.fire({
      title: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Log out!',
          'You have been logged out.',
          'success'
        )
        this.authService.logout();
        this.router.navigate(['/']);
      }
    })

  }
}
