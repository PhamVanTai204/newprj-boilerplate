using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.AutoMapper;
using newprj.Entities;

namespace newprj.CartItems.Dtos
{
    [AutoMapTo(typeof(CartItem))]
    public class CreateCartItemDto
    {
        public int ProductId { get; set; } // ID sản phẩm
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string UrlImage { get; set; }
        public int Quantity { get; set; } // Số lượng sản phẩm
        public int CartId { get; set; } // ID giỏ hàng chứa sản phẩm này
    }
}
