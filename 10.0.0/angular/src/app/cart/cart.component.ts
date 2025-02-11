import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ChitietProductDialogComponent } from '@app/products/chitiet-product-dialog/chitiet-product-dialog.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from '@node_modules/rxjs/dist/types';
import { PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { CartDto, CartItemDto, CartService, ProductDto, ProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { error } from 'console';

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


  showProduct(productId: number): void {
    this.showProductDialog(productId);
  }
  showProductDialog(id?: number): void {
    let createOrEditProductDialog: BsModalRef;
    createOrEditProductDialog = this._modalService.show(
      ChitietProductDialogComponent,
      {
        class: "modal-lg",
        initialState: {
          id: id,
        },
      }
    )
  }  // Lưu danh sách ID sản phẩm đã chọn vào Local Storage
  saveSelectedProductsToLocal() {
    localStorage.setItem('selectedProductIds', JSON.stringify(this.selectedProductIds));
  }
  // Kiểm tra sản phẩm có được chọn không
  isChecked(productId: number): boolean {
    return this.selectedProductIds.includes(productId);
  }
  // Thêm hoặc xóa sản phẩm khỏi danh sách đã chọn
  toggleProductSelection(productId: number) {
    if (this.isChecked(productId)) {
      this.selectedProductIds = this.selectedProductIds.filter(id => id !== productId);
    } else {
      this.selectedProductIds.push(productId);
    }
    this.saveSelectedProductsToLocal();
    this.updateSelectedProducts();
  }

  // Cập nhật danh sách sản phẩm đã chọn
  updateSelectedProducts() {
    this.selectAll = this.cartItems.every(item => this.isChecked(item.productId));
  }

  // Chọn hoặc bỏ chọn tất cả sản phẩm
  toggleSelectAll() {
    if (this.selectAll) {
      this.selectedProductIds = this.cartItems.map(item => item.productId);
    } else {
      this.selectedProductIds = [];
    }
    this.saveSelectedProductsToLocal();
    this.updateSelectedProducts();
  }

  // Xóa sản phẩm đã chọn khỏi danh sách
  removeSelectedItems() {
    this.selectedProducts = this.cartItems.filter(item => this.isChecked(item.productId));

    this.cartItems = this.cartItems.filter(item => !this.isChecked(item.productId));
    console.log("cart item ", this.cartItems);

    console.log("dãy selectted", this.selectedProducts);

    for (let i = 0; i < this.selectedProducts.length; i++) {
      this._cartService.removeItemFromCart(this.selectedProducts[i].id).subscribe({
        next: () => {
          console.log('Đã xóa sản phẩm:', this.selectedProducts[i]);
          // Cập nhật giỏ hàng sau khi xóa
          this.cartItems = this.cartItems.filter(item => item.id !== this.selectedProducts[i]);
        },
        error: (err) => {
          console.error("lỗi khi xóa sản phẩm", this.selectedProductIds[i], "với lỗi", err)
        }
      });
    }
    this.selectedProductIds = [];
    this.saveSelectedProductsToLocal();
    this.updateSelectedProducts();
  }
  // Tính tổng số tiền trong giỏ cho những sản phẩm đã được chọn
  get totalSelectedAmount(): number {
    return this.cartItems
      .filter(item => this.selectedProductIds.includes(item.productId)) // Lọc các sản phẩm đã chọn
      .reduce((total, item) => total + (item.price * item.quantity), 0); // Tính tổng
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
      const userId = this.getUserIdFromToken(token);

      if (!userId) {
        console.log('No token found');
        this.setLoading(false); // tắt load khi không có userId
        return;
      }

      console.log('User ID:', userId); // Log ra userId
      console.log('JWT Token:', token);

      // Gọi service để lấy cart
      const cart = await this.getCart(userId).toPromise();
      this.cart = cart;  // Lưu dữ liệu giỏ hàng
      this.cartItems = this.cart.cartItems;

      console.log('Cart:', this.cart); // Log giỏ hàng
      console.log("cartItem là:", this.cartItems, "ĐỘ DÀI", this.cartItems.length);
      this.updateSelectedProducts();
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
