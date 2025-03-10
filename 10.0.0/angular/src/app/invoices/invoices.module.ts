import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesRoutingModule } from './invoices-routing.module';
import { InvoicesComponent } from './invoices.component'
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { InvoiceDialogComponent } from './invoice-dialog/invoice-dialog.component'
import { StepsModule } from 'primeng/steps';

import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';  // Sửa lại đường dẫn import
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { PaginatorModule } from 'primeng/paginator';  // Sửa lại đường dẫn import
import { HttpClient } from '@angular/common/http'; // Sửa lại đường dẫn import
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  declarations: [
    InvoicesComponent,
    InvoiceDialogComponent
  ],
  imports: [
    CommonModule,
    InvoicesRoutingModule,
    TableModule, TagModule, RatingModule, ButtonModule,
    StepsModule,
    CommonModule,
    FormsModule,
    TableModule,
    PaginatorModule,
    InputNumberModule
  ]
})
export class InvoicesModule { }
