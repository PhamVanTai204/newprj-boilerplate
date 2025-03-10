import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { InvoiceDto, InvoiceService } from '@shared/service-proxies/service-proxies';
import { Location } from '@angular/common';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { PermissionCheckerService } from '@node_modules/abp-ng2-module';
import { AppConsts } from '@shared/AppConsts';

@Component({
  selector: 'app-invoice-dialog',
  standalone: false,
  templateUrl: './invoice-dialog.component.html',
  styleUrl: './invoice-dialog.component.css'
})
export class InvoiceDialogComponent extends PagedListingComponentBase<InvoiceDto> implements OnInit {
  invoice: InvoiceDto;
  status: Number;
  permissions = AppConsts.permissions;

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    protected cd: ChangeDetectorRef,

    public bsModalRef: BsModalRef,
    private _invoiceService: InvoiceService,
    private _prermisstionsChecked: PermissionCheckerService

  ) {
    super(injector, cd);
  }
  isGranted(permissionName: string) {
    return this._prermisstionsChecked.isGranted(permissionName)
  }
  closeDialog() {
    this.bsModalRef.hide(); // Đóng modal
  }


  active: number = 0;

  ngOnInit() {
    this.status = this.invoice.status;
  }




  items = [
    { label: 'Chờ xác nhận' },
    { label: 'Đã xác nhận' },
    { label: 'Đang xử lý' },     // Đang chuẩn bị hàng (thay vì "Đã giao hàng")
    { label: 'Hoàn tất' },       // Đơn hàng đã hoàn tất (có thể đã thanh toán hoặc giao nội bộ)
    { label: 'Đã hủy' }
  ];
  getStatusText(status: Number) {
    switch (status) {
      case 0:
        return 'Chờ xác nhận';
      case 1:
        return 'Đã xác nhận';
      case 2:
        return 'Đã giao hàng';
      case 3:
        return 'Đã thanh toán';
      case 4:
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  }
  getStatusClass(status: Number): string {
    switch (status) {
      case 0: return 'status-pending';  // Chờ xác nhận
      case 1: return 'status-confirmed'; // Đã xác nhận
      case 2: return 'status-shipping'; // Đang giao hàng
      case 3: return 'status-paid'; // Đã thanh toán
      case 4: return 'status-cancelled'; // Đã hủy
      default: return 'status-unknown'; // Không xác định
    }
  }
  setActive(status: Number) {

    this._invoiceService.updateInvoice(this.invoice.id, status).subscribe({

      next: () => {
        this.notify.info(this.l('Update thành công'));
        this.status = status;

        this.onSave.emit();
        this.cd.detectChanges();

      },
      error: () => {


        this.notify.info(this.l('Update Không thành công'));

      }
    }
    );
  }
  list() {

  }
  delete() {

  }
}
