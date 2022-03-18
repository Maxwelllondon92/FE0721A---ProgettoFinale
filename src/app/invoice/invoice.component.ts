import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Invoice } from '../models/invoice.model';
import { InvoiceService } from './invoice.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  constructor(
    private invoiceSrv: InvoiceService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}
  displayedColumns: string[] = [
    'id',
    'data',
    'numero',
    'anno',
    'importo',
    'statoStr',
    'clienteStr',
    'azioni',
  ];
  isLoading = false;
  private routeSub!: Subscription;
  dataSource!: MatTableDataSource<Invoice>;
  tableLenght: number = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 20, 50];
  pageEvent!: PageEvent;
  enableCreateNewInvoice = false;
  customerId!: number;
  markedForDeletionId!: number | null;
  admin!: boolean;

  ngOnInit(): void {
    let userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.admin = userData.roles.includes('ROLE_ADMIN');
    this.routeSub = this.route.params.subscribe((params) => {
      this.customerId = params['id'];
      this.getAllInvoices();
    });
  }

  @ViewChild(MatInput) input!:MatInput;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  getAllInvoices() {
    this.isLoading = true;
    if (this.customerId != undefined) {
      this.invoiceSrv
        .getInvoicesByCustomer(this.customerId)
        .subscribe((res) => {
          this.refineResponse(res);
          this.dataSource = new MatTableDataSource(res);
          this.tableLenght = res.length;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.enableCreateNewInvoice = true;
          this.isLoading = false;
        });
    } else {
      let invoices: Invoice[] = [];
      this.invoiceSrv.getInvoicesPageCount().subscribe((pages) => {
        for (let i = 0; i < pages; i++) {
          this.invoiceSrv.getAllInvoices(i).subscribe((res) => {
            invoices = invoices.concat(res);
              this.refineResponse(invoices);
              this.dataSource = new MatTableDataSource(invoices);
              this.tableLenght = invoices.length;
              this.dataSource.paginator = this.paginator;
              this.isLoading = false;
              this.dataSource.sort = this.sort;
          });
        }
      });
    }
  }
  refineResponse(res: Invoice[]) {
    for (let item of res) {
      item.statoStr = item.stato.nome;
      item.cliente
      ? null
      : alert(`ERRORE: la fattura ${item.id} è senza cliente`);
      item.clienteStr = item.cliente ? item.cliente.ragioneSociale : 'null';
    }
  }
  applyFilter(text: string) {
    this.dataSource.filter = text.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openDialog(clientId: number): void {
    this.markedForDeletionId = clientId;
    const dialogRef = this.dialog.open(InvoiceDeleteDialog, {
      data: { id: this.markedForDeletionId },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.markedForDeletionId = null;
      this.getAllInvoices();
    });
  }
}

@Component({
  selector: 'invoice-del-dialog',
  template: `
    <h1 mat-dialog-title>Conferma Rimozione</h1>
    <div mat-dialog-content>
      <p>Sei certo di voler eliminare questa fattura?</p>
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
        (click)="deleteInvoice(data.id)"
      >
        Elimina
      </button>
      <button *ngIf="!deleteInProgress || error" mat-button mat-dialog-close>
        Annulla
      </button>
    </div>
  `,
})
export class InvoiceDeleteDialog {
  constructor(
    private invoiceSrv: InvoiceService,
    public dialogRef: MatDialogRef<InvoiceDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}
  deleteInProgress = false;
  error!: any;
  deleteInvoice(id: number) {
    this.deleteInProgress = true;
    this.invoiceSrv.deleteInvoicesByClientId(id).subscribe(() => {
      this.invoiceSrv.deleteInvoiceById(id).subscribe(
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
