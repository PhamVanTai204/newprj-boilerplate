    using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.AutoMapper;
using newprj.Entities;
using newprj.InvoiceItems.Dtos;

namespace newprj.Invoices.Dtos
{
    [AutoMapTo(typeof(Invoice))]
    public class CreateInvoiceDto
    {
        public long UserId { get; set; } // ID của người dùng mua hàng
        public string UserName { get; set; }

        
         public decimal TotalAmount { get; set; } // Tổng tiền của hóa đơn

        public DateTime InvoiceDate { get; set; } = DateTime.Now; // Ngày tạo hóa đơn

        
        public InvoiceStatus Status { get; set; } = InvoiceStatus.Placed; // Trạng thái mặc định là Đã đặt hàng

        public string ShippingAddress { get; set; } // Địa chỉ giao hàng

        public List<CreateInvoiceItemDto> InvoiceItems { get; set; } // Danh sách sản phẩm trong hóa đơn

    }
}
