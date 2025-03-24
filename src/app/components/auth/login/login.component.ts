import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
loginForm: FormGroup;
errorMessage: string = '';

  constructor(private authService: AuthService, private fb:FormBuilder) {
    this.loginForm = this.fb.group({
      email:['', 
        [Validators.required, Validators.email]
      ],
      password: ['', 
        [Validators.required]
      ]
    })
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  async login() {
    if (this.loginForm.invalid) {
      console.log("Form is invalid");
      return;
    }
  
    const { email, password } = this.loginForm.value; // Get values
    const result = await this.authService.login(email, password);
    if (typeof result === 'string') {
      this.errorMessage = result; // Show error message
    }
    }

    closeErrorMessage(){
      this.errorMessage ='';
    }

}
