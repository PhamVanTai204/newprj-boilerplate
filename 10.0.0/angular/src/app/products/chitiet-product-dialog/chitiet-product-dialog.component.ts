import { ChangeDetectorRef, Component, Injector, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
 import { AppComponentBase } from '@shared/app-component-base';
import { ProductDto, ProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chitiet-product-dialog',
  standalone: false,
   templateUrl: './chitiet-product-dialog.component.html',
  styleUrl: './chitiet-product-dialog.component.css'
})
export class ChitietProductDialogComponent extends AppComponentBase implements OnInit {
  
  product: ProductDto = new ProductDto();
  id: number; 

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
  this._productService.get(this.id).subscribe((result: ProductDto) => {
    this.product = result;
     this.cd.detectChanges();
  });  }
  goBack(){
    
  }
  
}
