import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComunePackage, Customer, CustomerPackage, Provincia, ProvinciaPackage } from '../models/customer.model';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}
  getCustomer(customerId: number) {
    return this.http.get<Customer>(
      environment.pathApi + '/api/clienti/' + customerId
    );
  }
  getAllCustomers() {
    return this.http
      .get<CustomerPackage>(
        environment.pathApi + `/api/clienti?sort=id&size=2000`
      )
      .pipe(
        map((res) => {
          return res.content;
        })
      );
  }
  getAllProvince(){
    return this.http
      .get<ProvinciaPackage>(
        environment.pathApi + `/api/province?sort=id&size=2000`
      )
      .pipe(
        map((res) => {

          return res.content;
        })
      );
  }
  getAllComuni(){
    return this.http
      .get<ComunePackage>(
        environment.pathApi + `/api/comuni?sort=id&size=2000`
      )
      .pipe(
        map((res) => {
          return res.content;
        })
      );
  }
  addCustomer(customer: Customer) {
    return this.http
      .post<Customer>(environment.pathApi + '/api/clienti/', customer)
  }
  editCustomer(customer: Customer,customerId:number){
    return this.http
      .put<Customer>(environment.pathApi + '/api/clienti/'+customerId, customer)
  }
  deleteCustomer(customerId: number) {
    return this.http
      .delete(environment.pathApi + '/api/clienti/' + customerId)
  }
}
