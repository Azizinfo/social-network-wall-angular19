import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [RouterLink, MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!: FormGroup; 
 

  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private snackbar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    this.userService.getUser(this.loginForm.value.email).then((res: any) => {
      console.log(res);
      if(res.length > 0){
        if(res[0].password === this.loginForm.value.password){
          console.log('Login successful');
          this.snackbar.open('Login successful', 'ok');
          this.userService.user = res[0];
          this.router.navigate(['/posts']);
          localStorage.setItem('user', JSON.stringify(res[0]));
        }else{
          console.log('Invalid password');
          this.snackbar.open('Invalid password', 'ok');
        }
      }else{
        console.log('User not found');
        this.snackbar.open('User not found', 'ok');
      }
    }).catch((err: any) => {
      console.log(err);
    });

  }

}

 
  
  

