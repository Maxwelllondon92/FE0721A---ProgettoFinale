import { Customer } from "./customer.model"

export interface Invoice{
  id: number,
    data: string,
    numero: number,
    anno: number,
    importo: number,
    stato: State,
    statoStr?:string,
    cliente:Customer,
    clienteStr?:string
}
export interface State{
  id: number,
  nome?: string
}

export interface InvoicePackage{
  content:Invoice[],
  totalPages:number
}
