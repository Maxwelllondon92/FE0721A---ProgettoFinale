import {
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceService } from '../invoice/invoice.service';
import { Customer } from '../models/customer.model';
import { CustomerService } from './customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {
  constructor(
    private invoiceSrv: InvoiceService,
    private customerSrv: CustomerService,
    private dialog: MatDialog
  ) {
    this.getAllCustomers();
  }
  ngOnInit(): void {
    let userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.admin = userData.roles.includes('ROLE_ADMIN');
  }
  displayedColumns: string[] = [
    'id',
    'ragioneSociale',
    'email',
    'partitaIva',
    'azioni',
  ];
  isLoading = false;
  dataSource!: MatTableDataSource<Customer>;
  filter!:string
  tableLenght: number = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 20, 50];
  pageEvent!: PageEvent;
  admin!: boolean;
  invoices!: number|null;
  markedForDeletionId!: number | null;

  @ViewChild(MatInput) input!:MatInput
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  getAllCustomers() {
    this.isLoading = true;
    this.customerSrv.getAllCustomers().subscribe((res) => {
      this.dataSource = new MatTableDataSource(res);
      this.tableLenght = res.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
      this.applyFilter(this.input.value)
    });
  }
  openDialog(clientId: number): void {
    this.invoiceSrv.getInvoicesByCustomer(clientId).subscribe((res) => {
      if (res.length > 0) {
        this.invoices = res.length;
      }
      this.markedForDeletionId = clientId;
      const dialogRef = this.dialog.open(CustomerDeleteDialog, {
        data: { id: this.markedForDeletionId, invoices: this.invoices },
      });

      dialogRef.afterClosed().subscribe(() => {
        this.markedForDeletionId = null;
        this.invoices=null
        this.getAllCustomers();
      });
    });
  }
  deleteCustomer(id: any) {
    this.customerSrv.deleteCustomer(id.id).subscribe((res) => {
      this.getAllCustomers();
    });
  }

  applyFilter(text: string) {
    this.dataSource.filter = text.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

@Component({
  selector: 'dialog-conferma-rimuovi',
  template: `
    <h1 mat-dialog-title>Conferma Rimozione</h1>
    <div mat-dialog-content>
      <p *ngIf="!invoices">Sei certo di voler eliminare questo cliente?</p>
      <p *ngIf="invoices">
        Risultano {{ invoices }} fatture a nome di questo cliente.<br />Se
        procedi verranno tutte eliminate irreversibilmente!<br />Sei
        assolutamente certo di voler proseguire?
      </p>
    </div>

    <div *ngIf="deleteInProgress && !error" class="text-center">
      <div
        class="spinner-border spinner-border-sm text-danger mt-3"
        role="status"
      ></div>
    </div>
    <span *ngIf="error" class="text-danger">
      {{ error.error.status }} - {{ error.error.error }}
    </span>
    <div mat-dialog-actions>
      <button
        *ngIf="!deleteInProgress && !error"
        mat-button
        color="warn"
        (click)="deleteCustomer(data.id)"
      >
        Elimina
      </button>
      <button *ngIf="!deleteInProgress || error" mat-button mat-dialog-close>
        Annulla
      </button>
    </div>
  `,
})
export class CustomerDeleteDialog {
  constructor(
    private invoiceSrv: InvoiceService,
    private customerSrv: CustomerService,
    public dialogRef: MatDialogRef<CustomerDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; invoices: number|null }
  ) {}
  deleteInProgress = false;
  error!: any;
  invoices = this.data.invoices;
  deleteCustomer(id: number) {
    this.deleteInProgress = true;
      this.invoiceSrv.deleteInvoicesByClientId(id).subscribe(() => {
        this.customerSrv.deleteCustomer(id).subscribe(
          (res) => {
            this.dialogRef.close();
          },
          (error) => {
            this.error = error;
          }
        );
      });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
