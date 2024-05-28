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
    const items = this.getAmountAndId(); // Get the array of items
    const idCounts: Record<number, number> = {}; // Mapping of IDs to their counts

    // Aggregate the counts of each ID
    for (const { amount, id } of items) {
      if (idCounts[id]) {
        idCounts[id] += amount;
      } else {
        idCounts[id] = amount;
      }
    }
  
    // Generate an array of repeated IDs based on the aggregated counts
    const repeatedIds: number[] = [];
    for (const [id, count] of Object.entries(idCounts)) {
      repeatedIds.push(...Array(count).fill(Number(id)));
    }
  
    // Now, repeatedIds contains the aggregated array of IDs to be passed to checkCustomer
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
    // Retrieve the array from localStorage, expecting it to be a stringified version of an array
    let localStorageData = localStorage.getItem('ToCart'); // Replace 'yourKey' with the actual key used to store the array
    
    if (!localStorageData) {
      return []; // Return an empty array if nothing was found
    }
    
    // Parse the stringified array back into an array of objects
    let dataArray = JSON.parse(localStorageData);
  
    // Map through the array to transform each object into the desired format
    let transformedData = dataArray.map((item: idAndAmount) => ({
      amount: Number(item.quantity),
      id: Number(item.id)
    }));
  
    return transformedData;
  }


  private createRepeatedIds(amount: number, id: number): number[] {
    console.log(new Array(amount).fill(id));
    return new Array(amount).fill(id);
  }
}
