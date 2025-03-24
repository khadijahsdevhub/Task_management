import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  constructor(private fb:FormBuilder, private authService:AuthService){
    this.registerForm = this.fb.group({
      username: ['',
        [Validators.required, Validators.minLength(3)]
      ],
      email: ['',
        [Validators.required, Validators.email]
      ],
      password: ['', 
        [Validators.required, Validators.minLength(6)]
      ],
      confirmPassword: ['',  [Validators.required] ]
    }, {validators: this.matchPasswords});
    
  }

    // Getters for easier template access
    get username() { return this.registerForm.get('username'); }
    get email() { return this.registerForm.get('email'); }
    get password() { return this.registerForm.get('password'); }
    get confirmPassword() { return this.registerForm.get('confirmPassword'); }

    matchPasswords(form: FormGroup) {
      const password = form.get('password')?.value;
      const confirmPassword = form.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { mismatch: true };
    }

  async register() {
    if (this.registerForm.invalid) {
      console.log("Form is invalid");
      return;
    }

    const { email, password } = this.registerForm.value;
    const result = await this.authService.register(email,password);
    if (typeof result === 'string') {
      this.errorMessage = result; // Show error message
    }

  }

  closeErrorMessage(){
    this.errorMessage ='';
  }
  
}
