import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ProductDto, ProductDtoPagedResultDto, ProductServiceProxy } from '../../shared/service-proxies/service-proxies';
import { catchError, finalize, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CreateProductDialogComponent } from './create-product-dialog/create-product-dialog.component';
import { UpdateProductDialogComponent } from './update-product-dialog/update-product-dialog.component';
import { PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { ActivatedRoute } from '@node_modules/@angular/router';
import { Cloudinary, CloudinaryImage } from '@node_modules/@cloudinary/url-gen';
import { fill, thumbnail } from "@cloudinary/url-gen/actions/resize";
import { log } from 'console';
import { focusOn } from '@node_modules/@cloudinary/transformation-builder-sdk/qualifiers/gravity';
import { ChitietProductDialogComponent } from './chitiet-product-dialog/chitiet-product-dialog.component';

@Component({

  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  animations: [appModuleAnimation()],

})
export class ProductsComponent extends PagedListingComponentBase<ProductDto> implements OnInit {
  products: ProductDto[] = [];
  keyword = "";
  isActive: boolean | null;
  advancedFiltersVisible = false;
  filteredLocationList: ProductDto[] = [];

  currentPage = 1; // Trang hiện tại
  totalPages = 0; // Tổng số trang
  pageSize: number = 15;

  ngOnInit(): void {

    this.list();

  }

  constructor(
    injector: Injector,

    private _productService: ProductServiceProxy,
    protected cd: ChangeDetectorRef,
    private _modalService: BsModalService,
    private _activatedRoute: ActivatedRoute,

  ) {
    super(injector, cd);
    this.keyword = this._activatedRoute.snapshot.queryParams["keyword"] || "";
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

  isLoading = true; // Trạng thái tải dữ liệu
  // Hàm thay đổi trạng thái loading
  setLoading(loading: boolean): void {
    this.isLoading = loading;
    this.cd.detectChanges(); // Cập nhật lại giao diện khi thay đổi trạng thái loading
  }
  addtoPageList(): void {
    this.filteredLocationList = [];
    const startIndex = (this.currentPage - 1) * 15;
    const endIndex = this.currentPage === 1 ? 15 : this.currentPage * 15;
    this.filteredLocationList = this.products.slice(startIndex, endIndex);

    this.cd.detectChanges();
  }
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.addtoPageList();
    }
  }
  // hàm load dữ liệu
  list(): void {
    console.log("bắt đầu load");
    this.setLoading(true); // Bật trạng thái loading

    this._productService.getAll(this.keyword, this.isActive, 'name', 0, 10)
      .pipe(
        finalize(() => {
          this.primengTableHelper.hideLoadingIndicator();
        })
      )
      .subscribe((result: ProductDtoPagedResultDto) => {
        this.products = result.items.reverse();
        this.totalPages = Math.ceil(result.totalCount / this.pageSize);
        this.addtoPageList();
        this.setLoading(false);
        this.cd.detectChanges();
      });
  }
  // this._productService.getAll(this.keyword, this.isActive, 'name', 0, 10)
  //     .pipe(
  //       map(result => result.items,result.to), // Trả về danh sách sản phẩm
  //       catchError(err => {
  //         console.error("Error loading products:", err);
  //         return of([]); // Trả về mảng rỗng khi có lỗi
  //       })
  //     )
  // phân trang mỗi trang có 15 item  
  //    prd.length =n  
  //  trang thì sẽ sang trang tiếp theo với các item của trang đó
  /// tương tự lùi lại cũng thế 14 29 
  //    dùng for 

  //     .subscribe(products => {
  //       // Cập nhật danh sách sản phẩm sau khi nhận được kết quả
  //       this.products = products;
  //       console.log("xong hàm get:", this.products);
  //       this.filteredLocationList = products; // Cập nhật filteredLocationList
  //       this.setLoading(false); // Tắt trạng thái loading sau khi dữ liệu đã được tải        
  //       this.cd.detectChanges();
  //     });
  //   console.log("hết hàm load:", this.products);
  createProduct(): void {
    this.showCreateOrEditProductDialog();
  }
  editProduct(product: ProductDto): void {
    this.showCreateOrEditProductDialog(product.id);
  }
  showProduct(product: ProductDto): void {
    this.showProductDialog(product.id);
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
          if (this.filteredLocationList.length === 1) {

            this.changePage(this.currentPage - 1)
          }

          this.list(); // Cập nhật danh sách sản phẩm

        });

    }

  }
  showProductDialog(id?: number): void {
    let createOrEditProductDialog: BsModalRef;
    createOrEditProductDialog = this._modalService.show(
      ChitietProductDialogComponent,
      {
        class: "modal-lg",
        initialState: {
          id: id,
          screen: true,
        },
      }
    )
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

      if (!id) {
        this.changePage(1);
        this.list();
      } else {
        this.list();
      }
    });
  }
  clearFilters(): void {

    this.filteredLocationList = this.products; // Reset lại danh sách lọc
  }


}




