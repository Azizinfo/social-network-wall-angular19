import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  imports: [MatIconModule, MatMenuModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {

  constructor(public userService: UserService, private router:Router) { }

  logout(){
    this.userService.user = null;
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

}
