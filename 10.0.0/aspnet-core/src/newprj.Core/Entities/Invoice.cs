using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.Domain.Entities.Auditing;
using newprj.Authorization.Users;

namespace newprj.Entities
{
    public class Invoice : FullAuditedEntity<int>
    {
        [Required]
        public long UserId { get; set; } // ID của người dùng mua hàng
        public string userName { get; set; }
        public virtual User User { get; set; }
        


        [Required]
        public decimal TotalAmount { get; set; } // Tổng tiền của hóa đơn

        [Required]
        public DateTime InvoiceDate { get; set; } = DateTime.Now; // Ngày tạo hóa đơn

        [Required]
        public InvoiceStatus Status { get; set; } = InvoiceStatus.Placed; // Trạng thái mặc định là Đã đặt hàng
        public string ShippingAddress { get; set; } // Địa chỉ giao hàng
        public virtual ICollection<InvoiceItem> InvoiceItems { get; set; } // Danh sách sản phẩm trong hóa đơn
    }

    public enum InvoiceStatus
    {
        Placed,       // Đã đặt hàng
        Confirmed,    // Đã xác nhận
        Shipping,     // Đang giao hàng
        Paid,         // Đã thanh toán
        Cancelled     // Đã hủy
    }
}
