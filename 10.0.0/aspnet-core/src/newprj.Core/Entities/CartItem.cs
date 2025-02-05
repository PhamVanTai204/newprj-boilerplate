using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities.Auditing;

namespace newprj.Entities
{
    public class CartItem : FullAuditedEntity<int>
    {
        [Required]
        public int ProductId { get; set; } // ID sản phẩm
        public virtual Product Product { get; set; } // Navigation property

        [Required]
        public int Quantity { get; set; } // Số lượng sản phẩm

        [Required]
        public int CartId { get; set; } // ID giỏ hàng
        public virtual Cart Cart { get; set; } // Navigation property

    }
}
