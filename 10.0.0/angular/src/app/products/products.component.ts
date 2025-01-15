import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ProductDto, ProductServiceProxy } from '../../shared/service-proxies/service-proxies';
import { catchError, finalize, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CreateProductDialogComponent } from './create-product-dialog/create-product-dialog.component';
import { UpdateProductDialogComponent } from './update-product-dialog/update-product-dialog.component';
import { PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { ActivatedRoute } from '@node_modules/@angular/router';
import { Cloudinary, CloudinaryImage } from '@node_modules/@cloudinary/url-gen';
import {fill, thumbnail} from "@cloudinary/url-gen/actions/resize";
import { log } from 'console';
import { focusOn } from '@node_modules/@cloudinary/transformation-builder-sdk/qualifiers/gravity';
declare const cloudinary: any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  animations: [appModuleAnimation()],

})
export class ProductsComponent extends PagedListingComponentBase<ProductDto> implements OnInit {
  products: ProductDto[] = []; 
  keyword ="";
  isActive: boolean |null;
  advancedFiltersVisible = false;
  filteredLocationList:ProductDto[]=[];
  img!: CloudinaryImage;
  src: string = '';
  cloudName = "da5wgbt3m";
  uploadPreset="tpgzin";
  myWidget;

  constructor(
    injector: Injector,

    private _productService: ProductServiceProxy, 
    protected cd: ChangeDetectorRef,
    private _modalService: BsModalService,
    private _activatedRoute: ActivatedRoute,
    
  ) { 
    super(injector, cd);
   this.keyword = this._activatedRoute.snapshot.queryParams["keyword"] ||"";
    this.filteredLocationList = this.products
   
  }
  searchPRD(text: string): void {
    if (!text) {
      this.filteredLocationList = this.products;
    } else {
      this.filteredLocationList = this.products.filter(
        product => product?.name.toLowerCase().includes(text.toLowerCase())
      );
    }
  }
  
  

  ngOnInit(): void {
    console.log("bắt đầu init");

    this.list();
    console.log("prd khi hết hàm load trong oninit", this.products);
     

    this.myWidget = cloudinary.createUploadWidget(
      {
        cloudName: this.cloudName,
        uploadPreset: this.uploadPreset,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          // Lưu URL của ảnh vào đối tượng sản phẩm
          this.src = result.info.secure_url;
          alert("Thêm ảnh thành công!");
          this.list();
    
          // Cập nhật thẻ img trên giao diện (nếu cần)
          document
            .getElementById("uploadedimage")
            .setAttribute("src", result.info.secure_url);
        }
      }
    );
    
 


  }
  openWidget() {
    this.myWidget.open();
  }

  isLoading = true; // Trạng thái tải dữ liệu
  // Hàm thay đổi trạng thái loading
  setLoading(loading: boolean): void {
    this.isLoading = loading;
    this.cd.detectChanges(); // Cập nhật lại giao diện khi thay đổi trạng thái loading
  }


  list(): void {
    console.log("bắt đầu load");
    this.setLoading(true); // Bật trạng thái loading
    this._productService.getAll(this.keyword, this.isActive, 'name', 0, 10)
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
        this.filteredLocationList = products; // Cập nhật filteredLocationList
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
  delete(product: ProductDto): void {
    const confirmation = window.confirm(`Bạn chắc chắn muốn xóa sản phẩm: ${product.name}?`);

    if (confirmation) {
        this.setLoading(true); // Hiển thị trạng thái loading
        this._productService
            .delete(product.id)
            .pipe(
                finalize(() => {
                    this.setLoading(false); // Tắt trạng thái loading sau khi xóa xong
                })
            )
            .subscribe(() => {
                alert("Sản phẩm đã được xóa thành công.");
                this.list(); // Cập nhật danh sách sản phẩm
            });
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

  // Lắng nghe sự kiện lưu từ dialog
  createOrEditProductDialog.content.onSave.subscribe(() => {
      this.list(); // Cập nhật danh sách sản phẩm sau khi tạo hoặc sửa
  });
}
clearFilters(): void {
    
  this.filteredLocationList = this.products; // Reset lại danh sách lọc
}

   
}



 
