import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-address-info',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './address-info.component.html',
  styleUrl: './address-info.component.css'
})
export class AddressInfoComponent {
fb = inject(FormBuilder);

custumerInfo = this.fb.group({
  Id: [0],
  Name: '',
  Lastname: '',
  Address: '',
  city: '',
  PostNumber: '',
  PhoneNumber:'',
  mail: ''
})
}
