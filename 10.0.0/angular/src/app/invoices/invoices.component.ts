import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@node_modules/@angular/router';
import { PermissionCheckerService } from '@node_modules/abp-ng2-module';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { CartDto, CartService, InvoiceDto, InvoiceDtoPagedResultDto, InvoiceService, ProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { catchError, finalize, map } from 'rxjs/operators';
import { InvoiceDialogComponent } from './invoice-dialog/invoice-dialog.component';
import { AppConsts } from '@shared/AppConsts';
@Component({
  selector: 'app-invoices',
  standalone: false,
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css'
})
export class InvoicesComponent extends PagedListingComponentBase<InvoiceDto> implements OnInit {
  invoices: InvoiceDto[];
  cart: CartDto = new CartDto();
  keyword = "";

  isLoading = false;

  totalRecords: Number;
  permissions = AppConsts.permissions;
  first: number = 0; // Vị trí bắt đầu trang
  totalPages = 0; // Tổng số trang
  skipCount: number = 0;

  setLoading(loading: boolean): void {
    this.isLoading = loading;
    this.cd.detectChanges(); // Cập nhật lại giao diện khi thay đổi trạng thái loading
  }

  constructor(
    injector: Injector,
    public _cartService: CartService,

    private _productService: ProductServiceProxy,
    protected cd: ChangeDetectorRef,
    private _modalService: BsModalService,
    private _activatedRoute: ActivatedRoute,
    private _invoiceService: InvoiceService,
    private _prermisstionsChecked: PermissionCheckerService
  ) {
    super(injector, cd);

  }
  searchPRD(text: string): void {

    this.keyword = text;
    this.list();

  }
  onPageChange(event: any) {
    this.first = event.first; // Giá trị skipCount
    this.pageSize = event.rows; // Số sản phẩm trên mỗi trang
    this.skipCount = this.first;
    this.list(); // Gọi API để lấy dữ liệu trang mới
  }
  ngOnInit() {
    this.list();
  }
  isGranted(permissionName: string) {
    return this._prermisstionsChecked.isGranted(permissionName)
  }

  list() {
    this.setLoading(true);
    const token = this.getCookie('Abp.AuthToken'); // Lấy token từ cookie
    const userId = this.getUserIdFromToken(token);


    if (this.isGranted(this.permissions.invoiceAdin)) {
      this._invoiceService.getAll(this.keyword, this.skipCount, this.pageSize)
        .pipe(
          finalize(() => {
            this.primengTableHelper.hideLoadingIndicator();
          })
        ).subscribe((result: InvoiceDtoPagedResultDto) => {
          this.invoices = (result.items ?? []).reverse();
          this.totalRecords = result.totalCount ?? 0;;
          this.setLoading(false);
          this.cd.detectChanges();

        })
    } else {
      this._invoiceService.getInvoiceByUserID(userId, this.skipCount, this.pageSize)
        .pipe(
          finalize(() => {
            this.primengTableHelper.hideLoadingIndicator();
          })

        ).subscribe((result: InvoiceDtoPagedResultDto) => {


          this.invoices = (result.items ?? []).reverse();
          this.totalRecords = result.totalCount ?? 0;;

          this.setLoading(false);
          this.cd.detectChanges();

        })


    }

  }
  delete() {

  }


  getStatusText(status: Number) {
    switch (status) {
      case 0:
        return 'Chờ xác nhận';
      case 1:
        return 'Đã xác nhận';
      case 2:
        return 'Đang sử lý';
      case 3:
        return 'Hoàn tất';
      case 4:
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  }
  getStatusClass(status: number): string {
    switch (status) {
      case 0: return 'status-pending';  // Chờ xác nhận
      case 1: return 'status-confirmed'; // Đã xác nhận
      case 2: return 'status-shipping'; // Đang giao hàng
      case 3: return 'status-paid'; // Đã thanh toán
      case 4: return 'status-cancelled'; // Đã hủy
      default: return 'status-unknown'; // Không xác định
    }
  }

  showInvoiceDialog(invoice: InvoiceDto): void {
    let invoiceDialog: BsModalRef;
    invoiceDialog = this._modalService.show(
      InvoiceDialogComponent,
      {
        class: "modal-lg",
        initialState: {
          invoice,
        },
      }
    )
    invoiceDialog.content.onSave.subscribe(() => {
      this.list();

    });
    console.log(invoice);

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


}
