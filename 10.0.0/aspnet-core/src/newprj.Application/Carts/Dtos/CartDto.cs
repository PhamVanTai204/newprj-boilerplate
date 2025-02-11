using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using newprj.CartItems.Dtos;
using newprj.Entities;

namespace newprj.Carts.Dtos
{
    [AutoMapFrom(typeof(Cart))]

    public class CartDto : EntityDto<int> // ✅ Kế thừa EntityDto<int>
    {
        public long UserId { get; set; } // ID người dùng
         public List<CartItemDto> CartItems { get; set; } // Danh sách sản phẩm trong giỏ hàng
    }
}
