import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { ProductsComponent } from '../products.component';
import { CreateProductDto, ProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/app-component-base';
import { log } from 'console';
   
@Component({
 
  templateUrl: './create-product-dialog.component.html',
  styleUrl: './create-product-dialog.component.css'
})
export class CreateProductDialogComponent extends AppComponentBase   implements OnInit {
  
   saving = false;
   product: CreateProductDto = new CreateProductDto();
 
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
      this.cd.detectChanges();
   }
 
   save(): void {
     this.saving = true;
 
     this._productService.create(this.product).subscribe(
       () => {
         this.notify.info(this.l('SavedSuccessfully'));
         this.bsModalRef.hide();
         this.onSave.emit();
         console.log("thành công create");
         
       },
       () => {
        
         this.saving = false;
         console.log("không thành  công create", this.product);

       }
     );
   }
   
  

}
