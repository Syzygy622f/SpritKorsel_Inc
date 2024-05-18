import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-address-info',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './address-info.component.html',
  styleUrl: './address-info.component.css'
})
export class AddressInfoComponent {
fb = inject(FormBuilder);
http = inject(HttpClient);
costumerForm = this.fb.group({
  Id: [0],
  Name: '',
  Lastname: '',
  Address: '',
  City: '',
  PostNumber: '',
  PhoneNumber:'',
  Mail: ''
})


public async checkCostumer(){

  const mail = this.costumerForm.value.Mail;
  const exist = null;

this.http.get<boolean>(`https://localhost:7289/api/Customer/costumerExist?mail=${mail}`).subscribe((response) => {
console.log("response", response)
if(response == true){

}
if (response == false){

}
})
}
}
