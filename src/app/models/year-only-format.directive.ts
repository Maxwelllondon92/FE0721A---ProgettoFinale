import { Directive } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
export const YEAR_ONLY = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
  },
};
@Directive({
  selector: '[YearOnly]',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: YEAR_ONLY }],
})
export class YearOnlyFormat {
  constructor() {}
}
