import { forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { SharedModule } from 'primeng/api';
import { ProductsRoutingModule } from './products-routing.module';
import { UpdateProductDialogComponent } from './update-product-dialog/update-product-dialog.component';
import { CreateProductDialogComponent } from './create-product-dialog/create-product-dialog.component';
import { ChitietProductDialogComponent } from './chitiet-product-dialog/chitiet-product-dialog.component';

import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';  // Sửa lại đường dẫn import
import { TableModule } from 'primeng/table';  // Sửa lại
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { PaginatorModule } from 'primeng/paginator';  // Sửa lại đường dẫn import
import { HttpClient } from '@angular/common/http'; // Sửa lại đường dẫn import
import { CloudinaryModule } from '@cloudinary/ng';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  declarations: [
    CreateProductDialogComponent,
    UpdateProductDialogComponent,
    ProductsComponent,
    ChitietProductDialogComponent

  ],
  imports: [
    SharedModule,
    ProductsRoutingModule,
    CommonModule,
    FormsModule,
    TableModule,
    PaginatorModule,
    CloudinaryModule,
    InputNumberModule
  ],

})
export class ProductsModule { }
