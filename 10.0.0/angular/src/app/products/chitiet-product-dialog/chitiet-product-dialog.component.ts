import { ChangeDetectorRef, Component, Injector, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/app-component-base';
import { CartDto, CartItemDto, CartService, CreateCartItemDto, ProductDto, ProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { EventEmitter } from '@angular/core';
import { Observable } from '@node_modules/rxjs/dist/types';
import { log } from 'console';
import { AppConsts } from '@shared/AppConsts';
import { PermissionCheckerService } from '@node_modules/abp-ng2-module';

@Component({
  selector: 'app-chitiet-product-dialog',
  standalone: false,
  templateUrl: './chitiet-product-dialog.component.html',
  styleUrl: './chitiet-product-dialog.component.css'
})
export class ChitietProductDialogComponent extends AppComponentBase implements OnInit {
  cart: CartDto = new CartDto();
  permissions = AppConsts.permissions;
  isGranted(permissionName: string) {
    return this._prermisstionsChecked.isGranted(permissionName)
  }
  product: ProductDto = new ProductDto();
  cartItem: CreateCartItemDto = new CreateCartItemDto();
  id: number;
  screen: boolean;
  quantity: number = 1; // Giá trị mặc định

  @Output() onSave = new EventEmitter<any>();
  constructor(
    injector: Injector,
    public _productService: ProductServiceProxy,
    public _cartService: CartService,
    public bsModalRef: BsModalRef,
    private cd: ChangeDetectorRef,
    private _prermisstionsChecked: PermissionCheckerService

  ) {
    super(injector);
  }
  ngOnInit(): void {
    this.getCart();

    this._productService.get(this.id).subscribe((result: ProductDto) => {
      this.product = result;
      this.cd.detectChanges();
    });
  }
  goBack() {

  }

  increase(): void {
    this.quantity++;
  }

  decrease(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addProductToCart() {
    this._cartService.addItemToCart(
      this.product.id,
      this.product.name,
      this.product.price,
      this.product.urlImage,
      this.quantity,
      this.cart.id
    ).subscribe({

      next: () => {
        this.notify.info(this.l('SavedSuccessfully'));



      },
      error: () => {


        console.log("không thành  công create", this.product);

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
