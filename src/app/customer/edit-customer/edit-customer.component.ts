import { isNull } from '@angular/compiler/src/output/output_ast';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Comune, Provincia } from 'src/app/models/customer.model';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss'],
})
export class EditCustomerComponent {
  constructor(
    private customerSrv: CustomerService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.createForm();
  }
  isLoading = true;
  customerId!: number;
  private routeSub!: Subscription;

  customerForm!: FormGroup;

  comuneSedeOp!: FormGroup;
  provinciaSedeOp!: FormGroup;
  comuneSedeLeg!: FormGroup;
  provinciaSedeLeg!: FormGroup;

  province!: Provincia[];
  comuni!: Comune[];

  selectedProvinciaOp!: number | string;
  selectedProvinciaLeg!: number | string;

  createForm() {
    this.customerSrv.getAllProvince().subscribe((res) => {
      this.province = res;
    });
    this.customerSrv.getAllComuni().subscribe((res) => {
      this.comuni = res;
    });
    this.routeSub = this.route.params.subscribe((params) => {
      //Form Vuoto per Nuovo Cliente
      this.customerForm = this.fb.group({
        id: new FormControl(null),
        // Azienda
        ragioneSociale: new FormControl('', [Validators.required]),
        partitaIva: new FormControl('', [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
        ]),
        tipoCliente: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.email]),
        pec: new FormControl('', [Validators.email]),
        telefono: new FormControl(''),
        // Referente
        nomeContatto: new FormControl(''),
        cognomeContatto: new FormControl(''),
        telefonoContatto: new FormControl(''),
        emailContatto: new FormControl('', [
          Validators.required,
          Validators.email,
        ]),
        //Indirizzi
        indirizzoSedeOperativa: this.fb.group({
          via: new FormControl(''),
          civico: new FormControl(''),
          cap: new FormControl(''),
          localita: new FormControl(''),
          comune: this.fb.group({
            id: new FormControl('', [Validators.required]),
            nome: '',
            provincia: this.fb.group({
              id: new FormControl('', [Validators.required]),
            }),
          }),
        }),
        indirizzoSedeLegale: this.fb.group({
          via: new FormControl(''),
          civico: new FormControl(''),
          cap: new FormControl(''),
          localita: new FormControl(''),
          comune: this.fb.group({
            id: new FormControl('', [Validators.required]),
            nome: '',
            provincia: this.fb.group({
              id: new FormControl('', [Validators.required]),
            }),
          }),
        }),
      });
      if (params['id'] != undefined) {
        this.isLoading = true;
        this.customerSrv.getCustomer(params['id']).subscribe((customer) => {
          //Form Precompilato per Modifica Cliente
          this.customerId = customer.id;
          const emptyAddress = {
            id: 0,
            via: '',
            civico: '',
            cap: '',
            localita: '',
            comune: {
              id: 0,
              nome: '',
              provincia: {
                id: 0,
                nome: '',
                sigla: '',
              },
            },
          };
          if (!customer.indirizzoSedeOperativa) {
            customer.indirizzoSedeOperativa = emptyAddress;
          }
          if (!customer.indirizzoSedeLegale) {
            customer.indirizzoSedeLegale = emptyAddress;
          }
          this.customerForm.patchValue({
            ragioneSociale: customer.ragioneSociale,
            partitaIva: customer.partitaIva,
            tipoCliente: customer.tipoCliente,
            email: customer.email,
            pec: customer.pec,
            telefono: customer.telefono,
            nomeContatto: customer.nomeContatto,
            cognomeContatto: customer.cognomeContatto,
            telefonoContatto: customer.telefonoContatto,
            emailContatto: customer.emailContatto,
            indirizzoSedeOperativa:{
              via: customer.indirizzoSedeOperativa.via,
              civico: customer.indirizzoSedeOperativa.civico,
              cap: customer.indirizzoSedeOperativa.cap,
              localita: customer.indirizzoSedeOperativa.localita,
              comune:{
                id: String(customer.indirizzoSedeOperativa.comune.id),
                provincia: {
                  id: String(
                    customer.indirizzoSedeOperativa.comune.provincia.id
                  ),
                },
              },
            },
            indirizzoSedeLegale: {
              via: customer.indirizzoSedeLegale.via,
              civico: customer.indirizzoSedeLegale.civico,
              cap: customer.indirizzoSedeLegale.cap,
              localita: customer.indirizzoSedeLegale.localita,
              comune: {
                id: String(customer.indirizzoSedeLegale.comune.id),
                provincia: {
                  id: String(customer.indirizzoSedeLegale.comune.provincia.id),
                },
              },
            },
          });
          this.isLoading = false;
          this.updateSelectedProvinciaOp(true);
          this.updateSelectedProvinciaLeg(true);
        });
      } else {
        this.isLoading = false;
        this.updateSelectedProvinciaOp(true);
        this.updateSelectedProvinciaLeg(true);
      }
    });
  }
  updateSelectedProvinciaOp(init?: boolean) {
    this.comuneSedeOp = (
      this.customerForm.controls['indirizzoSedeOperativa'] as FormGroup
    ).controls['comune'] as FormGroup;
    this.provinciaSedeOp = this.comuneSedeOp.controls['provincia'] as FormGroup;
    this.selectedProvinciaOp = this.provinciaSedeOp.controls['id'].value;
    this.selectedProvinciaOp
      ? this.comuneSedeOp.controls['id'].enable()
      : this.comuneSedeOp.controls['id'].disable();
    init ? null : this.comuneSedeOp.controls['id'].reset();
  }
  updateSelectedProvinciaLeg(init?: boolean) {
    this.comuneSedeLeg = (
      this.customerForm.controls['indirizzoSedeLegale'] as FormGroup
    ).controls['comune'] as FormGroup;
    this.provinciaSedeLeg = this.comuneSedeLeg.controls[
      'provincia'
    ] as FormGroup;
    this.selectedProvinciaLeg = this.provinciaSedeLeg.controls['id'].value;
    this.selectedProvinciaLeg
      ? this.comuneSedeLeg.controls['id'].enable()
      : this.comuneSedeLeg.controls['id'].disable();
    init ? null : this.comuneSedeLeg.controls['id'].reset();
  }
  getErrRagioneSociale() {
    return this.getErrMsg('ragioneSociale');
  }
  getErrPartitaIva() {
    return this.getErrMsg('partitaIva');
  }
  getErrTipoCliente() {
    return this.getErrMsg('tipoCliente');
  }
  getErrEmail() {
    return this.getErrMsg('email');
  }
  getErrPEC() {
    return this.getErrMsg('pec');
  }
  getErrEmailContatto() {
    return this.getErrMsg('emailContatto');
  }
  getErrProvinciaOp() {
    return this.getErrMsg('id', this.provinciaSedeOp);
  }
  getErrComuneOp() {
    return this.getErrMsg('id', this.comuneSedeOp);
  }
  getErrProvinciaLeg() {
    return this.getErrMsg('id', this.provinciaSedeLeg);
  }
  getErrComuneLeg() {
    return this.getErrMsg('id', this.comuneSedeLeg);
  }
  getErrMsg(path: string, el: AbstractControl = this.customerForm) {
    if (el.hasError('required', path)) {
      return 'Il campo non può essere vuoto';
    }
    if (el.hasError('minlength', path) || el.hasError('maxlength', path)) {
      return 'La partita Iva deve essere di 11 caratteri';
    }
    return el.hasError('email', path) ? 'Email non Valida' : void 0;
  }
  onSubmit() {
    if (this.customerForm.invalid) {
      return;
    }
    if (!this.customerId) {
      this.customerSrv.addCustomer(this.customerForm.value).subscribe((res) => {
        this.router.navigate(['/customer']);
      });
    } else {
      this.customerSrv
        .editCustomer(this.customerForm.value, this.customerId)
        .subscribe((res) => {
          this.router.navigate(['/customer']);
        });
    }
  }
}
