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
  first: number = 0; // Vị trí bắt đầu trang
  totalRecords: number // Tổng số sản phẩm
  totalPages = 0; // Tổng số trang
  skipCount: number;
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
    debugger

    this.keyword = text;
    console.log("fasjhfgjkhase", this.keyword);
    this.list();
    // if (!text) {
    //   this.filteredLocationList = this.products;
    // } else {
    //   this.filteredLocationList = this.products.filter(
    //     product => product?.name.toLowerCase().includes(text.toLowerCase())
    //   );
    // }
  }

  isLoading = true; // Trạng thái tải dữ liệu
  // Hàm thay đổi trạng thái loading
  setLoading(loading: boolean): void {
    this.isLoading = loading;
    this.cd.detectChanges(); // Cập nhật lại giao diện khi thay đổi trạng thái loading
  }



  onPageChange(event: any) {
    this.first = event.first; // Giá trị skipCount
    this.pageSize = event.rows; // Số sản phẩm trên mỗi trang
    this.skipCount = this.first;
    this.list(); // Gọi API để lấy dữ liệu trang mới
  }

  // hàm load dữ liệu
  list(): void {
    console.log("bắt đầu load");
    this.setLoading(true); // Bật trạng thái loading

    this._productService.getAll(
      this.keyword,
      this.isActive,
      'name desc',
      this.skipCount,
      this.pageSize
    )
      .pipe(
        finalize(() => {
          this.primengTableHelper.hideLoadingIndicator();
        })
      )
      .subscribe((result: ProductDtoPagedResultDto) => {
        this.products = result.items.reverse();
        this.totalRecords = result.totalCount;
        this.filteredLocationList = this.products;
        this.setLoading(false);
        this.cd.detectChanges();
      });
  }
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
        this.first = 0;
        this.skipCount = 0
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




