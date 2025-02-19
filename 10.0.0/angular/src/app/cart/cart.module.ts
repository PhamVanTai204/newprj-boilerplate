import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { CartRoutingModule } from './cart-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CloudinaryModule } from '@cloudinary/ng';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';

import { CartComponent } from './cart.component';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';

@NgModule({
  declarations: [
    CartComponent,
    PaymentDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CartRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CloudinaryModule,

    TagModule,
    RatingModule,



    // PrimeNG Modules
    TableModule,
    PaginatorModule,
    InputNumberModule,
    ButtonModule,
    CardModule,
    DialogModule,
    ToastModule,
    CheckboxModule,
    RadioButtonModule,
    DropdownModule,
    PanelModule,
    ProgressSpinnerModule,
    DividerModule,
    InputTextModule
  ],
})
export class CartModule { }
