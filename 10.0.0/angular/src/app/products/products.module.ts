import { NgModule } from '@angular/core';
 import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { SharedModule } from 'primeng/api';
import { ProductsRoutingModule } from './products-routing.module';
import { UpdateProductDialogComponent } from './update-product-dialog/update-product-dialog.component';
import { CreateProductDialogComponent } from './create-product-dialog/create-product-dialog.component';

@NgModule({
    declarations: [
        CreateProductDialogComponent,
        UpdateProductDialogComponent,
         ProductsComponent,
     ],
    imports: [SharedModule, ProductsRoutingModule, CommonModule  ],
})
export class ProductsModule {}
