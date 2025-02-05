using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;

namespace newprj.Carts.Dtos
{

    // DTO dùng cho việc cập nhật Cart
    public class UpdateCartDto : EntityDto<int> // ✅ Kế thừa EntityDto<int>
    {
        public decimal TotalPrice { get; set; } // Tổng giá mới của giỏ hàng
    }
}
