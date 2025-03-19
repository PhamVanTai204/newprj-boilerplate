import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { ProductsComponent } from '../products.component';
import { CreateProductDto, ProductDto, ProductDtoPagedResultDto, ProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/app-component-base';
import { error, log } from 'console';
import { CloudinaryImage } from '@node_modules/@cloudinary/url-gen';
import { catchError, finalize, map } from 'rxjs/operators';
declare const cloudinary: any;

@Component({

  templateUrl: './create-product-dialog.component.html',
  styleUrl: './create-product-dialog.component.scss'
})
export class CreateProductDialogComponent extends AppComponentBase implements OnInit {
  keyword = "";
  isActive: boolean | null;
  saving = false;
  totalPages = 0; // Tổng số trang
  skipCount: number;
  product: CreateProductDto = new CreateProductDto();
  img!: CloudinaryImage;
  totalRecords: number;
  cloudName = "da5wgbt3m";
  uploadPreset = "tpgzin";
  myWidget;
  products: ProductDto[] = [];

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _productService: ProductServiceProxy,
    public bsModalRef: BsModalRef,
    private cd: ChangeDetectorRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.cd.detectChanges();
    this.myWidget = cloudinary.createUploadWidget(
      {
        cloudName: this.cloudName,
        uploadPreset: this.uploadPreset,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          // Lưu URL của ảnh vào đối tượng sản phẩm
          this.product.urlImage = result.info.secure_url; // Gán URL ảnh vào product.urlImage
          this.cd.detectChanges();
          alert("Thêm ảnh thành công!");

          // Cập nhật thẻ img trên giao diện (nếu cần)
          document
            .getElementById("uploadedimage")
            .setAttribute("src", result.info.secure_url);
        }
      }
    );
    this.loadProducts()


  }
  loadProducts(): void {
    this._productService.getAll(
      "",  // Không lọc theo keyword
      true,
      "name desc",
      0,    // Skip 0 để lấy từ đầu
      100   // Giới hạn lấy 100 sản phẩm (tùy chỉnh theo nhu cầu)
    ).subscribe((result: ProductDtoPagedResultDto) => {
      console.log("Danh sách sản phẩm:", result.items);
    });
  }
  openWidget() {
    this.myWidget.open();
  }
  save(): void {
    this.saving = true;
    if (!this.product.name || !this.product.price || !this.product.description || !this.product.stockQuantity) {
      alert("Bạn cần nhập đầy đủ thông tin");
      this.saving = false;
      return;
    }

    // Kiểm tra các điều kiện khác nếu cần
    if (this.product.price <= 0) {
      alert("Giá phải lớn hơn 0");
      this.saving = false;
      return;
    }
    if (this.product.stockQuantity < 0) {
      alert("Số lượng tồn kho phải lớn hơn hoặc bằng 0");
      this.saving = false;
      return;
    }
    // Kiểm tra nếu chưa có ảnh
    if (!this.product.urlImage) {
      alert("Vui lòng chọn ảnh cho sản phẩm trước khi lưu!");
      this.saving = false;
      this.openWidget();
      return;
    }




    this._productService.create(this.product).subscribe({

      next: () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
        console.log("thành công thêm");

      },
      error: () => {

        this.saving = false;
        console.log("không thành  công create", this.product);

      }
    }
    );
  }



}
