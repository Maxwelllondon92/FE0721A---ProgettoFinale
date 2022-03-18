import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Invoice, InvoicePackage } from '../models/invoice.model';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  constructor(private http: HttpClient) {}
  getInvoicesPageCount(){
    return this.http
      .get<InvoicePackage>(
        environment.pathApi + `/api/fatture?size=2000`
      )
      .pipe(
        map((res) => {
          return res.totalPages;
        })
      );
  }
  getAllInvoices(page:number=0) {
    return this.http
      .get<InvoicePackage>(
        environment.pathApi + `/api/fatture?sort=id&page=${page}&size=2000`
      )
      .pipe(
        map((res) => {
          return res.content;
        })
      );
  }
  getInvoiceById(invoiceId: number) {
    return this.http.get<Invoice>(
      environment.pathApi + `/api/fatture/${invoiceId}`
    );
  }
  getInvoicesByCustomer(customerId: number,page:number=0) {
    return this.http
      .get<InvoicePackage>(
        environment.pathApi +
          `/api/fatture/cliente/${customerId}?sort=id&page=${page}&size=2000`
      )
      .pipe(
        map((res) => {
          return res.content;
        })
      );
  }
  addInvoice(invoice: Invoice) {
    return this.http.post(environment.pathApi + '/api/fatture', invoice);
  }
  editInvoice(id: number, invoice: Invoice) {
    return this.http.put(environment.pathApi + `/api/fatture/${id}`, invoice);
  }
  deleteInvoiceById(invoiceId: number) {
    return this.http.delete(environment.pathApi + `/api/fatture/${invoiceId}`);
  }
  deleteInvoicesByClientId(customerId: number) {
    return this.http.delete(
      environment.pathApi + `/api/fatture/cliente/${customerId}`
    );
  }
}
