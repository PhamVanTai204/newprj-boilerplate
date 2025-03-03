import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ChitietProductDialogComponent } from '@app/products/chitiet-product-dialog/chitiet-product-dialog.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from '@node_modules/rxjs/dist/types';
import { PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { CartDto, CartItemDto, CartService, ProductDto, ProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { error } from 'console';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent extends PagedListingComponentBase<CartDto> implements OnInit {
  ngOnInit(): void {
    // Lấy danh sách ID sản phẩm đã chọn từ Local Storage
    const storedSelectedIds = localStorage.getItem('selectedProductIds');
    this.selectedProductIds = storedSelectedIds ? JSON.parse(storedSelectedIds) : [];
    this.updateSelectedProducts();
    this.list();
    // Kiểm tra sản phẩm nào đã chọn từ Local Storage

  }
  constructor(
    private _productService: ProductServiceProxy,
    private _cartService: CartService,
    protected cd: ChangeDetectorRef,
    injector: Injector,
    private _modalService: BsModalService,


  ) {
    super(injector, cd);
  }

  cart: CartDto = new CartDto();
  cartItems: CartItemDto[] = [];
  isLoading = true; // Trạng thái tải dữ liệu
  selectedProductIds: number[] = [];
  selectAll: boolean = false;
  selectedProducts: any[] = [];
  userId: number;
  showPayDialog(): void {
    if (this.selectedProductIds.length === 0) {
      alert("Bạn chưa chọn sản phẩm!")
    } else {
      this.showProductDialog(undefined, this.userId);

    }

  }
  showProduct(productId: number): void {
    this.showProductDialog(productId);
  }
  showProductDialog(id?: number, userId?: number): void {
    let createOrEditProductDialog: BsModalRef;
    if (userId) {
      createOrEditProductDialog = this._modalService.show(
        PaymentDialogComponent,
        {
          class: "modal-lg",
          initialState: {
            userId
          },
        }
      );
    } else {
      createOrEditProductDialog = this._modalService.show(
        ChitietProductDialogComponent,
        {
          class: "modal-lg",
          initialState: {
            id: id,
          },
        }
      )

    }
    // Lắng nghe sự kiện lưu từ dialog
    createOrEditProductDialog.content.onSave.subscribe(() => {

      if (!id) {

        this.removeSelectedItems();
      } else {
        this.list();
      }
    });

  } // Lưu danh sách ID sản phẩm đã chọn vào Local Storage
  saveSelectedProductsToLocal() {
    localStorage.setItem('selectedProductIds', JSON.stringify(this.selectedProductIds));
  }
  isChecked(id: number): boolean {
    return this.selectedProductIds.includes(id);
  }
  cleanUpInvalidSelectedProducts() {
    // Lấy danh sách ID trong giỏ hàng
    const cartItemIds = this.cartItems.map(item => item.id);

    // Lọc ra những ID không có trong cartItems
    this.selectedProductIds = this.selectedProductIds.filter(id => cartItemIds.includes(id));

    // Cập nhật lại Local Storage
    this.saveSelectedProductsToLocal();
  }


  toggleProductSelection(id: number) {
    if (this.isChecked(id)) {
      this.selectedProductIds = this.selectedProductIds.filter(pid => pid !== id);
    } else {
      this.selectedProductIds.push(id);
    }
    this.saveSelectedProductsToLocal();
    this.updateSelectedProducts();
  }

  updateSelectedProducts() {
    this.selectAll = this.cartItems.every(item => this.isChecked(item.id));
  }

  toggleSelectAll() {
    if (this.selectAll) {
      this.selectedProductIds = this.cartItems.map(item => item.id);
    } else {
      this.selectedProductIds = [];
    }
    this.saveSelectedProductsToLocal();
    this.updateSelectedProducts();
  }


  // Xóa sản phẩm đã chọn khỏi danh sách
  removeSelectedItems() {
    this.selectedProducts = this.cartItems.filter(item => this.isChecked(item.id));
    this.cartItems = this.cartItems.filter(item => !this.isChecked(item.id));

    for (let i = 0; i < this.selectedProducts.length; i++) {
      this._cartService.removeItemFromCart(this.selectedProducts[i].id).subscribe({
        next: () => {
          console.log('Đã xóa sản phẩm:', this.selectedProducts[i]);
          this.cartItems = this.cartItems.filter(item => item.id !== this.selectedProducts[i].id);
        },
        error: (err) => {
          console.error("Lỗi khi xóa sản phẩm", this.selectedProducts[i].id, "với lỗi", err)
        }
      });
    }
    this.selectedProductIds = [];
    this.saveSelectedProductsToLocal();
    this.updateSelectedProducts();
    this.list();
  }

  // Tính tổng số tiền trong giỏ cho những sản phẩm đã được chọn
  get totalSelectedAmount(): number {
    return this.cartItems
      .filter(item => this.selectedProductIds.includes(item.id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  }


  setLoading(loading: boolean): void {
    this.isLoading = loading;

    this.cd.detectChanges(); // Cập nhật lại giao diện khi thay đổi trạng thái loading
  }

  // Tăng số lượng sản phẩm
  increaseQuantity(cartItem: any): void {
    cartItem.quantity++;
    this._cartService.updateQuantitiCart(cartItem.id, cartItem.quantity).subscribe({
      next: () => {
        console.log("tăng giảm sản phẩm thành công:", cartItem);

      },
      error: (err) => {
        console.error("lỗi khi cập sản phẩm", cartItem.name, "với lỗi", err)

      }

    })
  }

  // Giảm số lượng sản phẩm
  decreaseQuantity(cartItem: CartItemDto): void {
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
      this._cartService.updateQuantitiCart(cartItem.id, cartItem.quantity).subscribe({
        next: () => {
          console.log("tăng giảm sản phẩm thành công:", cartItem);

        },
        error: (err) => {
          console.error("lỗi khi cập sản phẩm", cartItem.name, "với lỗi", err)

        }

      })
    }

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
  delete(): void {

  }
  deleteCartItemById(cartItem: CartItemDto) {
    this._cartService.removeItemFromCart(cartItem.id).subscribe({
      next: () => {
        console.log('Đã xóa sản phẩm: ', cartItem.name, "  khỏi giỏ hàng");
        // Cập nhật giỏ hàng sau khi xóa
        this.list();
      },
      error: (err) => {
        console.error("lỗi khi xóa sản phẩm", cartItem.name, "với lỗi", err)
      }
    });
  }
  updateQuantitiCartItemm(cartItem: CartItemDto) {

  }
  async list() {
    try {
      this.setLoading(true); // bắt đầu load

      const token = this.getCookie('Abp.AuthToken'); // Lấy token từ cookie
      this.userId = this.getUserIdFromToken(token);

      if (!this.userId) {
        console.log('No token found');
        this.setLoading(false); // tắt load khi không có userId
        return;
      }

      console.log('User ID:', this.userId); // Log ra userId
      console.log('JWT Token:', token);

      // Gọi service để lấy cart
      const cart = await this.getCart(this.userId).toPromise();
      this.cart = cart;  // Lưu dữ liệu giỏ hàng
      this.cartItems = this.cart.cartItems;

      console.log('Cart:', this.cart); // Log giỏ hàng
      console.log("cartItem là:", this.cartItems, "ĐỘ DÀI", this.cartItems.length);
      this.updateSelectedProducts();
      this.cleanUpInvalidSelectedProducts();
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      this.setLoading(false); // tắt load
    }


  }

  getCart(userId: number): Observable<CartDto> {
    return this._cartService.getCart(userId); // Gọi service lấy cart và trả về observable
  }






}