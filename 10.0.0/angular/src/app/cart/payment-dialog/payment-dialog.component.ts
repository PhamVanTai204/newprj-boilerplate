import { ChangeDetectorRef, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CartItemDto, CartService, InvoiceItemDto, InvoiceService, UpdateStockQuantityProductDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-payment-dialog',
  standalone: false,
  templateUrl: './payment-dialog.component.html',
  styleUrl: './payment-dialog.component.css'
})
export class PaymentDialogComponent implements OnInit {
  selectedProductIds: number[] = [];
  cartItems: CartItemDto[] = [];
  isLoading = true; // Trạng thái tải dữ liệu
  invoiceItems: InvoiceItemDto[] = [];
  userId: number;
  invoiceDate: Date;
  userName: string = '';
  userPhone: string = '';
  userAddress: string = '';
  // Tính tổng số tiền trong giỏ cho những sản phẩm đã được chọn
  get totalSelectedAmount(): number {
    return this.cartItems
      .filter(item => this.selectedProductIds.includes(item.id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  get shippingAddress(): string {
    return `${this.userName} - ${this.userPhone} - ${this.userAddress}`;
  }

  setLoading(loading: boolean): void {
    this.isLoading = loading;

    this.cd.detectChanges(); // Cập nhật lại giao diện khi thay đổi trạng thái loading
  }

  ngOnInit(): void {

    const storedSelectedIds = localStorage.getItem('selectedProductIds');
    this.selectedProductIds = storedSelectedIds ? JSON.parse(storedSelectedIds) : [];
    console.log("Selected Product IDs:${{}}", this.selectedProductIds);
    this.list();
    this.cd.detectChanges();
  }
  @Output() onSave = new EventEmitter<any>();

  constructor(
    public _invoiceAppService: InvoiceService,
    public _cartAppservice: CartService,
    protected cd: ChangeDetectorRef,
    public bsModalRef: BsModalRef,


  ) {
  }
  updateStockQuantity() {
    const updatedProducts = this.cartItems.map(item => ({
      id: item.productId,
      stockQuantity: item.quantity - item.quantity
    }));

    this._invoiceAppService.updateStockQuantity(updatedProducts).subscribe({
      next: () => console.log('Cập nhật số lượng sản phẩm thành công!'),
      error: (err) => console.error('Lỗi cập nhật số lượng sản phẩm:', err)
    });
  }


  thanhtoan() {
    try {
      // Kiểm tra thông tin trước khi thanh toán
      if (!this.userName || !this.userPhone || !this.userAddress) {
        throw new Error('Vui lòng nhập đầy đủ thông tin trước khi thanh toán!');
      }


      // Gọi dịch vụ để tạo hóa đơn
      this._invoiceAppService
        .createInvoice(
          this.userId,
          this.userName,
          this.totalSelectedAmount,
          this.invoiceDate,
          0, // Trạng thái đơn hàng
          this.shippingAddress,
          this.invoiceItems
        )
        .subscribe(
          (response) => {
            console.log('Hóa đơn đã tạo:', response);

            // **Cập nhật số lượng sản phẩm sau khi tạo hóa đơn thành công**
            // this.updateStockQuantity();

            alert('Thanh toán thành công!');
            this.bsModalRef.hide();

            this.onSave.emit();

          },
          (error) => {
            console.error('Lỗi khi tạo hóa đơn:', error);
          }
        );
    } catch (error) {
      console.error('Lỗi hệ thống:', error);
      alert(error.message || 'Có lỗi xảy ra, vui lòng thử lại!');
    }
  }


  async list() {
    this.setLoading(true);

    if (this.selectedProductIds.length === 0) {
      this.setLoading(false);
      return;
    }

    try {
      const cartItems = await Promise.all(
        this.selectedProductIds.map(id => this._cartAppservice.getCartItemById(id).toPromise())
      );
      this._invoiceAppService.convertCartItem(cartItems).subscribe({
        next: (items) => {
          this.invoiceItems = items;
          console.log('Converted Invoice Items:', this.invoiceItems);
        },
        error: (error) => console.error('Error:', error)
      });
      this.cartItems = cartItems;
    } catch (error) {
      console.error('Lỗi khi lấy CartItem:', error);
    } finally {
      this.setLoading(false);
    }
  }


}