import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductDto, ProductServiceProxy } from '../../shared/service-proxies/service-proxies';
import { catchError, finalize, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CreateProductDialogComponent } from './create-product-dialog/create-product-dialog.component';
import { UpdateProductDialogComponent } from './update-product-dialog/update-product-dialog.component';
import { PagedListingComponentBase } from '@shared/paged-listing-component-base';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: ProductDto[] = [];

  constructor(private _productService: ProductServiceProxy, private cd: ChangeDetectorRef, private _modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    console.log("bắt đầu init");

    this.loadProduct();
    console.log("prd khi hết hàm load trong oninit", this.products);
    // this.doSomethingWithProducts(); 

  }

  isLoading = true; // Trạng thái tải dữ liệu
  // Hàm thay đổi trạng thái loading
  setLoading(loading: boolean): void {
    this.isLoading = loading;
    this.cd.detectChanges(); // Cập nhật lại giao diện khi thay đổi trạng thái loading
  }


  loadProduct(): void {
    console.log("bắt đầu load");
    this.setLoading(true); // Bật trạng thái loading
    this._productService.getAll(undefined, true, 'name', 0, 10)
      .pipe(
        map(result => result.items), // Trả về danh sách sản phẩm
        catchError(err => {
          console.error("Error loading products:", err);
          return of([]); // Trả về mảng rỗng khi có lỗi
        })
      )
      .subscribe(products => {
        // Cập nhật danh sách sản phẩm sau khi nhận được kết quả
        this.products = products;
        console.log("xong hàm get:", this.products);
        this.setLoading(false); // Tắt trạng thái loading sau khi dữ liệu đã được tải        
        this.cd.detectChanges();
      });
    console.log("hết hàm load:", this.products);

  }
  createProduct(): void {
   this.showCreateOrEditProductDialog();
  }
  editProduct(product: ProductDto): void {
    this.showCreateOrEditProductDialog(product.id);
  }

  deleteProduct(product: ProductDto): void {
    const confirmation = window.confirm(`Bạn chắc chắn muốn xóa sản phẩm: ${product.name}?`);
  
    if (confirmation) {
      this.setLoading(true); // Tắt trạng thái loading sau khi dữ liệu đã được tải
      this._productService
        .delete(product.id)
        .pipe(
          finalize(() => {
            alert("Sản phẩm đã được xóa thành công.");
            this.setLoading(false); // Tắt trạng thái loading sau khi xóa xong
          })
        )
        .subscribe(() => {});
    }
  }
  


  showCreateOrEditProductDialog(id?: number): void {
    let createOrEditProductDialog: BsModalRef;
    if (!id) {
      createOrEditProductDialog = this._modalService.show(
        CreateProductDialogComponent,
        {
          class: "modal-lg",
        }
      );
    } else {
      createOrEditProductDialog = this._modalService.show(
        UpdateProductDialogComponent,
        {
          class: "modal-lg",
          initialState: {
            id: id,
          },
        }
      );
    }

    
    createOrEditProductDialog.content.onSave.subscribe(() => {
      this.setLoading(true); // Bật trạng thái loading khi lưu sản phẩm
    });
  }

   
}
