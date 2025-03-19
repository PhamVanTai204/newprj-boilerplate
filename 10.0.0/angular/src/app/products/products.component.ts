import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { CartDto, CartService, CreateCartItemDto, ProductDto, ProductDtoPagedResultDto, ProductServiceProxy } from '../../shared/service-proxies/service-proxies';
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
import { PermissionCheckerService } from '@node_modules/abp-ng2-module';
import { AppConsts } from '@shared/AppConsts';


@Component({

  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  animations: [appModuleAnimation()],

})
export class ProductsComponent extends PagedListingComponentBase<ProductDto> implements OnInit {
  products: ProductDto[] = [];
  cart: CartDto = new CartDto();
  cartItem: CreateCartItemDto = new CreateCartItemDto();
  id: number;

  keyword = "";
  isActive: boolean | null;
  advancedFiltersVisible = false;
  filteredLocationList: ProductDto[] = [];
  first: number = 0; // Vị trí bắt đầu trang
  totalRecords: number // Tổng số sản phẩm
  totalPages = 0; // Tổng số trang
  skipCount: number;
  permissions = AppConsts.permissions;

  quantity: number = 1; // Giá trị mặc  
  chitietProduct: ChitietProductDialogComponent
  ngOnInit(): void {
    this.getCart();

    this.list();

  }

  constructor(
    injector: Injector,

    private _productService: ProductServiceProxy,
    protected cd: ChangeDetectorRef,
    private _modalService: BsModalService,
    public _cartService: CartService,
    private _activatedRoute: ActivatedRoute,
    private _prermisstionsChecked: PermissionCheckerService
  ) {
    super(injector, cd);
    this.keyword = this._activatedRoute.snapshot.queryParams["keyword"] || "";
    this.filteredLocationList = this.products

  }
  searchPRD(text: string): void {

    this.keyword = text;
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

  isGranted(permissionName: string) {
    return this._prermisstionsChecked.isGranted(permissionName)
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
    this.showCreateOrEditProductDialog(null, this.totalRecords);
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
  showCreateOrEditProductDialog(id?: number, totalRecords?: number): void {
    let createOrEditProductDialog: BsModalRef;
    if (!id) {
      createOrEditProductDialog = this._modalService.show(
        CreateProductDialogComponent,
        {
          class: "modal-lg",
          initialState: {
            totalRecords: totalRecords
          },
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




  increase(): void {
    this.quantity++;
  }

  decrease(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addProductToCart(product: ProductDto) {
    this._cartService.addItemToCart(
      product.id,
      product.name,
      product.price,
      product.urlImage,
      this.quantity,
      this.cart.id
    ).subscribe({

      next: () => {
        this.notify.info(this.l('SavedSuccessfully'));



      },
      error: () => {


        console.log("không thành  công create", product);

      }
    }
    );
  }


  // Hàm lấy giá trị cookie theo tên
  getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }
  // Hàm giải mã JWT token
  decodeJWT(token) {
    const base64Url = token.split('.')[1]; // Tách phần Payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Thay đổi theo chuẩn Base64
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload); // Parse JSON payload
  }
  // Hàm lấy userId từ token
  getUserIdFromToken(token) {
    const decodedToken = this.decodeJWT(token);
    return decodedToken.sub; // Thay 'userId' là phần sub có thể để chat nó phân tích cho 
  }


  getCart() {
    const token = this.getCookie('Abp.AuthToken'); // Lấy token từ cookie
    const userId = this.getUserIdFromToken(token);
    this._cartService.getCart(userId).subscribe({
      next: (cartData) => {
        this.cart = cartData;
        console.log('Giỏ hàng:', this.cart);
      },
      error: (err) => {
        console.error('Lỗi khi lấy giỏ hàng:', err);

      }
    });
  }

}




