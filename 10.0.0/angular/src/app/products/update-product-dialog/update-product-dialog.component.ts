import { ChangeDetectorRef, Component, Injector, OnInit, Output, EventEmitter } from '@angular/core';
import { CreateProductDialogComponent } from '../create-product-dialog/create-product-dialog.component';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateProductDto, ProductDto, ProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CloudinaryImage } from '@node_modules/@cloudinary/url-gen';
declare const cloudinary: any;

@Component({

  templateUrl: './update-product-dialog.component.html',
  styleUrl: './update-product-dialog.component.scss'
})
export class UpdateProductDialogComponent extends AppComponentBase implements OnInit {
  saving = false;
  product: ProductDto = new ProductDto();
  id: number;
  img!: CloudinaryImage;
  src: string = '';
  cloudName = "da5wgbt3m";
  uploadPreset = "tpgzin";
  myWidget;
  public oldImagePublicId: string = ''; // Để lưu public_id của ảnh cũ

  ngOnInit(): void {
    this._productService.get(this.id).subscribe((result: ProductDto) => {
      this.product = result;
       this.cd.detectChanges();
    });
    this.myWidget = cloudinary.createUploadWidget(
      {
        cloudName: this.cloudName,
        uploadPreset: this.uploadPreset,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          // Gọi hàm xóa ảnh cũ trước khi cập nhật ảnh mới
           

          // Lưu URL của ảnh vào đối tượng sản phẩm
          this.product.urlImage = result.info.secure_url; // Gán URL ảnh vào product.urlImage
          this.cd.detectChanges();

          // Cập nhật thẻ img trên giao diện (nếu cần)
          document
            .getElementById("uploadedimage")
            .setAttribute("src", result.info.secure_url);
        }
      }
    );
  }

  // Lấy public_id từ URL ảnh
  
  // Xóa ảnh cũ trên Cloudinary
  

  openWidget() {
    this.myWidget.open();
  }





  @Output() onSave = new EventEmitter<any>();
  constructor(
    injector: Injector,
    public _productService: ProductServiceProxy,
    public bsModalRef: BsModalRef,
    private cd: ChangeDetectorRef
  ) {
    super(injector);
  }

  save(): void {
    this.saving = true;
    if (!this.product.urlImage) {
      alert("Hãy thêm ảnh cho sản phẩm!");
      this.saving = false;
      return;
    }
    this._productService.update(this.product).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit(true);
        console.log("thành công update");
      },
      () => {

        this.saving = false;
        console.log("không thành  công create", this.product);

      }
    );
  }


}
