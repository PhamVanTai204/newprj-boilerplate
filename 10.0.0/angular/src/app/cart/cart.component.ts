import { Component, OnInit } from '@angular/core';
import { CartService } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  ngOnInit(): void {
    this.getUserId()
  }
  constructor(private cartService: CartService) { }

  cartItems = [
    { id: 1, name: 'Sản phẩm A', price: 50000, quantity: 1, image: 'https://via.placeholder.com/80' },
    { id: 2, name: 'Sản phẩm B', price: 80000, quantity: 2, image: 'https://via.placeholder.com/80' },
    { id: 3, name: 'Sản phẩm C', price: 120000, quantity: 1, image: 'https://via.placeholder.com/80' }
  ];

  // Tính tổng số tiền trong giỏ
  get totalAmount(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Tăng số lượng sản phẩm
  increaseQuantity(item: any): void {
    item.quantity++;
  }

  // Giảm số lượng sản phẩm
  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
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
    return decodedToken.sub; // Thay 'userId' bằng tên trường của bạn trong payload
  }
  getUserId() {
    
    const token = this.getCookie('Abp.AuthToken'); // Lấy token từ cookie
    const userId = this.getUserIdFromToken(token); 
    if (userId) {
       console.log('User ID:', userId); // Log ra userId
    } else {
      console.log('No token found');
    
    }
    // Ví dụ: lấy token từ cookie
    console.log('JWT Token:', token);

  


  }

}
