using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using newprj.Entities;
using newprj.InvoiceItems.Dtos;

namespace newprj.Invoices.Dtos
{
    [AutoMapFrom(typeof(Invoice))]
    public class InvoiceDto : EntityDto<int>
    {
        public long UserId { get; set; } // ID của người dùng mua hàng

        public decimal TotalAmount { get; set; } // Tổng tiền của hóa đơn

        public DateTime InvoiceDate { get; set; } // Ngày tạo hóa đơn

        public InvoiceStatus Status { get; set; } // Trạng thái của hóa đơn

        public string ShippingAddress { get; set; } // Địa chỉ giao hàng

        public List<InvoiceItemDto> InvoiceItems { get; set; } // Danh sách sản phẩm trong hóa đơn
    }
}
