import { ChangeDetectorRef, Component, Injector, OnInit, Output, EventEmitter } from '@angular/core';
import {CreateProductDialogComponent} from '../create-product-dialog/create-product-dialog.component';
import { AppComponentBase } from '@shared/app-component-base';
 import { CreateProductDto, ProductDto, ProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
@Component({
 
  templateUrl: './update-product-dialog.component.html',
  styleUrl: './update-product-dialog.component.css'
})
export class UpdateProductDialogComponent extends AppComponentBase implements OnInit{
  saving = false;
  product : ProductDto = new  ProductDto();
  id : number;
   @Output() onSave = new EventEmitter<any>();
   constructor(
       injector: Injector,
       public _productService: ProductServiceProxy,
       public bsModalRef: BsModalRef,
       private cd: ChangeDetectorRef
     ) {
       super(injector);
     }
  ngOnInit(): void {
    this._productService.get(this.id).subscribe((result:ProductDto)=>{
      this.product = result;
      this.cd.detectChanges();
    })
  }
  save(): void {
    this.saving = true;

    this._productService.update(this.product).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit(true);
        console.log("thành công update");          
      },
      () => {
       
        this.saving = false;
        console.log("không thành  công create", this.product);

      }
    );
  }


}
