import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { CustomerService } from 'src/app/customer/customer.service';
import { State } from 'src/app/models/invoice.model';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.scss'],
})
export class EditInvoiceComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private invoiceSrv: InvoiceService,
    private customerSrv: CustomerService,
    private router: Router,
    private location: Location
  ) {}
  anno = new FormControl(moment(), Validators.required);
  invoiceForm: FormGroup = this.fb.group({
    data: new FormControl(moment(new Date()), Validators.required),
    numero: new FormControl(0),
    anno: this.anno,
    importo: new FormControl(null, Validators.required),
    stato: this.fb.group({
      id: new FormControl('2', Validators.required),
    }),
    cliente: new FormControl(),
  });
  customerId!: number;
  invoiceId!: number;
  routesub!: Subscription;
  isSending = false;
  isLoading = true;
  invoiceNum!: number;
  ragioneSociale!: string;

  ngOnInit(): void {
    this.invoiceForm.controls['numero'].disable();
    this.routesub = this.route.params.subscribe((params) => {
      this.customerId = params['customerId'];
      this.invoiceId = params['invoiceId'];
      if (this.invoiceId) {
        this.invoiceSrv.getInvoiceById(this.invoiceId).subscribe((res) => {
          let statoStr={id:String(res.stato.id)}
          this.invoiceForm.patchValue({
            data: res.data,
            numero: res.numero,
            anno: moment(res.anno, 'YYYY'),
            importo: res.importo,
            stato: statoStr,
          });
          this.invoiceNum = res.numero;
          this.ragioneSociale = res.cliente.ragioneSociale;
          this.isLoading = false;
        });
      } else {
        this.invoiceSrv
          .getInvoicesByCustomer(this.customerId)
          .subscribe((res) => {
            let ref = 0;
            for (let item of res) {
              item.numero > ref ? (ref = item.numero) : null;
            }
            ref++;
            this.invoiceForm.patchValue({
              numero: ref,
            });
            this.invoiceNum = ref;
            this.customerSrv.getCustomer(this.customerId).subscribe(res=>{
              this.ragioneSociale=res.ragioneSociale
              this.isLoading = false;
            })
          });
      }
    });
  }

  chosenYearHandler(
    normalizedYear: moment.Moment,
    datepicker: MatDatepicker<moment.Moment>
  ) {
    const ctrlValue = this.anno.value;
    console.log(normalizedYear);
    ctrlValue.year(normalizedYear.year());
    this.anno.setValue(ctrlValue);
    datepicker.close();
  }
  getErrData() {
    return this.invoiceForm.hasError('required', 'data')
      ? 'Il campo non può essere vuoto'
      : '';
  }
  getErrNumero() {
    return this.invoiceForm.hasError('required', 'numero')
      ? 'Il campo non può essere vuoto'
      : '';
  }
  getErrAnno() {
    return this.invoiceForm.hasError('required', 'anno')
      ? 'Il campo non può essere vuoto'
      : '';
  }
  getErrImporto() {
    return this.invoiceForm.hasError('required', 'importo')
      ? 'Il campo non può essere vuoto'
      : '';
  }
  goBack(){
    this.location.back()
  }
  onSubmit() {
    this.isLoading = true;

    this.customerSrv.getCustomer(this.customerId).subscribe((res) => {
      this.invoiceForm.controls['anno'].setValue(
        new Date(this.invoiceForm.controls['anno'].value).getFullYear()
      );
      this.invoiceForm.controls['data'].setValue(
        new Date(this.invoiceForm.controls['data'].value).toISOString()
      );
      this.invoiceForm.controls['cliente'].setValue(res);
      this.invoiceForm.controls['numero'].enable();

      if (!this.invoiceId) {
        //newInvoice
        this.invoiceSrv.addInvoice(this.invoiceForm.value).subscribe(() => {
          this.goBack()
        });
      } else {
        //editInvoice
        this.invoiceSrv.editInvoice(this.invoiceId, this.invoiceForm.value).subscribe(() => {
          this.goBack()
        });
      }
    });
  }
}
