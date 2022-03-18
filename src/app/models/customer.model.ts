export interface Customer {
  id: number;
  ragioneSociale: string;
  partitaIva: string;
  tipoCliente: string;
  email: string;
  pec: string;
  telefono: string;
  nomeContatto: string;
  cognomeContatto: string;
  telefonoContatto: string;
  emailContatto: string;
  indirizzoSedeOperativa: Address;
  indirizzoSedeLegale: Address;
  dataInserimento: Date;
  dataUltimoContatto: Date;
  fatturatoAnnuale: number;
}
interface Address {
  id: number;
  via: string;
  civico: string;
  cap: string;
  localita: string;
  comune: Comune;
}
export interface Comune{
  id: number;
    nome: string;
    provincia: Provincia;
}
export interface Provincia{
    id: number;
    nome: string;
    sigla: string;
}
export interface ProvinciaPackage{
  content:Provincia[]
}
export interface ComunePackage{
  content:Comune[]
}
export interface CustomerPackage {
  content: Customer[];
}
