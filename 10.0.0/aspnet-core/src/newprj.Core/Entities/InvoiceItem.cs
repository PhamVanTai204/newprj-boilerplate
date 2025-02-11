using System;
using System.ComponentModel.DataAnnotations;
using Abp.Domain.Entities.Auditing;

namespace newprj.Entities
{
    public class InvoiceItem : FullAuditedEntity<int>
    {
        [Required]
        public int InvoiceId { get; set; } // ID hóa đơn
        public virtual Invoice Invoice { get; set; }

        [Required]
        public int ProductId { get; set; } // ID sản phẩm
        public virtual Product Product { get; set; }

        [Required]
        public int Quantity { get; set; } // Số lượng sản phẩm

        [Required]
        public decimal Price { get; set; } // Giá tại thời điểm mua
        public string UrlImage { get; set; }


        public decimal TotalPrice; // Thành tiền của sản phẩm
    }
}
