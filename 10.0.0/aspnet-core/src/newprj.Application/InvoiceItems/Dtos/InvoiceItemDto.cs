using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using newprj.Entities;

namespace newprj.InvoiceItems.Dtos
{
    [AutoMapFrom(typeof(InvoiceItem))]
    public class InvoiceItemDto : EntityDto<int>
    {
         public int InvoiceId { get; set; } // ID hóa đơn
 
         public int ProductId { get; set; } // ID sản phẩm
 
         public int Quantity { get; set; } // Số lượng sản phẩm

   
        public string Name { get; set; }
        public decimal Price { get; set; } // Giá tại thời điểm mua
        public string UrlImage { get; set; }
    }
}
