using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using newprj.Entities;

namespace newprj.CartItems.Dtos
{
    [AutoMapTo(typeof(CartItem))]
    public class UpdateCartItemDto: EntityDto<int>
    {

        public int Quantity { get; set; } // Số lượng sản phẩm

    }
}
