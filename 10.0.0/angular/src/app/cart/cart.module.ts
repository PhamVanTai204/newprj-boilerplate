import { forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 import { SharedModule } from 'primeng/api';
import { CartRoutingModule } from './cart-routing.module';
 
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';  // Sửa lại đường dẫn import
import { TableModule } from 'primeng/table';  // Sửa lại
 import { PaginatorModule } from 'primeng/paginator';  // Sửa lại đường dẫn import
import { HttpClient } from '@angular/common/http'; // Sửa lại đường dẫn import
import {CloudinaryModule} from '@cloudinary/ng';
import { InputNumberModule } from 'primeng/inputnumber'; 
import { CartComponent } from './cart.component';
@NgModule({
  declarations: [
     CartComponent
     
  ],
  imports: [
    SharedModule,
    CartRoutingModule,
    CommonModule,
    FormsModule,
    TableModule,
    PaginatorModule,
    CloudinaryModule,
    InputNumberModule
  ],
  
})
export class CartModule {
  
}
