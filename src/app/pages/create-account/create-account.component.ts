import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  standalone: true, 
  selector: 'app-create-account',
  imports: [RouterLink, MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css'
})
export class CreateAccountComponent {

  createAccountForm!: FormGroup;

  constructor(private fb: FormBuilder, public userService: UserService, private router: Router) { }  

  ngOnInit(): void {
    this.createAccountForm = this.fb.group({ 
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  create(){  
    this.userService.createUser(this.createAccountForm.value).then((res:any)=>{
      console.log(res);
      this.userService.user = res;
      localStorage.setItem('user', JSON.stringify(res));
      this.router.navigate(['/posts']);
    }).catch((err)=>{
      console.log(err);
    });  
 }
}
 