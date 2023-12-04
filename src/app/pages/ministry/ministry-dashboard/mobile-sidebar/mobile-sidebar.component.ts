import { Component } from '@angular/core';
import {AuthService} from "../../../../shared/services";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-mobile-sidebar',
  templateUrl: './mobile-sidebar.component.html',
  styleUrls: ['./mobile-sidebar.component.css']
})
export class MobileSidebarComponent {
  activeLink: string = 'dashboard';

  setActiveLink(link: string) {
    this.activeLink = link;
  }

  constructor(private authService: AuthService, private router: Router) {}

  isMinistry(): boolean {
    const user = this.authService.getCurrentUserJson();
    return user && user.role === 'ministry';
  }

  isMerchant(): boolean {
    const user = this.authService.getCurrentUserJson();
    return user && user.role === 'merchant';
  }

  logout() {
    Swal.fire({
      title: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Log out!', 'You have been logged out.', 'success');
        this.authService.logOut();
        this.router.navigate(['/']);
      }
    });
  }
}
