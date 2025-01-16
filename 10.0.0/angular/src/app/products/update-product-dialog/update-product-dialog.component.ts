import { ChangeDetectorRef, Component, Injector, OnInit, Output, EventEmitter } from '@angular/core';
import { CreateProductDialogComponent } from '../create-product-dialog/create-product-dialog.component';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateProductDto, ProductDto, ProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CloudinaryImage } from '@node_modules/@cloudinary/url-gen';
declare const cloudinary: any;

@Component({

  templateUrl: './update-product-dialog.component.html',
  styleUrl: './update-product-dialog.component.css'
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
      this.oldImagePublicId = this.getPublicIdFromUrl(this.product.urlImage); // Lưu public_id của ảnh cũ
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
          if (this.oldImagePublicId) {
            this.deleteImage(this.oldImagePublicId); // Xóa ảnh cũ
          }

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
  private getPublicIdFromUrl(url: string): string {
    const urlParts = url.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = publicIdWithExtension.split('.')[0];
    return publicId;
  }

  // Xóa ảnh cũ trên Cloudinary
  private deleteImage(publicId: string): void {
    const deleteUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`;
    const body = {
      public_id: publicId,
    };

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    fetch(deleteUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Ảnh cũ đã được xóa:', data);
      })
      .catch(error => {
        console.error('Lỗi khi xóa ảnh cũ:', error);
      });
  }

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
