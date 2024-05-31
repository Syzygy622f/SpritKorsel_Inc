import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { user } from '../../models/User';
import { idAndAmount } from '../../models/IdAndAmount';

@Component({
  selector: 'app-address-info',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './address-info.component.html',
  styleUrl: './address-info.component.css',
})
export class AddressInfoComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  costumerForm = this.fb.group({
    Id: [0],
    Name: ['', Validators.required],
    Lastname: ['', Validators.required],
    Age:['', Validators.required],
    Address: ['', Validators.required],
    City: ['', Validators.required],
    PostNumber: ['', Validators.required],
    PhoneNumber: ['', Validators.required],
    Mail: ['', Validators.required],
    password: ['', Validators.required],
  });

  async handleclick(): Promise<void> {
    const items = this.getAmountAndId();
    const idCounts: Record<number, number> = {}; 

    // Aggregate the counts of each ID
    for (const { amount, id } of items) {
      if (idCounts[id]) {
        idCounts[id] += amount;
      } else {
        idCounts[id] = amount;
      }
    }
  
    const repeatedIds: number[] = [];
    for (const [id, count] of Object.entries(idCounts)) {
      repeatedIds.push(...Array(count).fill(Number(id)));
    }
  
    await this.checkCustomer(repeatedIds);
  }

  public async checkCustomer(repeatedIds: number[]) {
    const mail = this.costumerForm.value.Mail;
    const exist = null;

    this.http
      .get<boolean>(
        `https://localhost:7289/api/Customer/costumerExist?mail=${mail}`
      )
      .subscribe((response) => {
        console.log('response', response);
        if (response == false) {
          this.http
            .post<user>(
              'http://localhost:7289/api/Customer/costumer',
              this.costumerForm
            )
            .subscribe((userresponse) => {
              
            });
        }
      });
      console.log({ids: repeatedIds})

    this.http
      .post<number>(
        `https://localhost:7289/api/Customer/CreateInvoice?mail=${mail}`, repeatedIds ).subscribe((response) => {
  
        });
  }

  private getAmountAndId(): { amount: number, id: number }[] {
    let localStorageData = localStorage.getItem('ToCart'); 
    
    if (!localStorageData) {
      return []; 
    }
    
    let dataArray = JSON.parse(localStorageData);
  
    let transformedData = dataArray.map((item: idAndAmount) => ({
      amount: Number(item.quantity),
      id: Number(item.id)
    }));
  
    return transformedData;
  }
}
