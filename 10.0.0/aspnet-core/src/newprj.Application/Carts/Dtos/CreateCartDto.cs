using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.AutoMapper;
using newprj.Entities;

namespace newprj.Carts.Dtos
{
    [AutoMapTo(typeof(Cart))]
    // DTO dùng cho việc tạo mới Cart
    public class CreateCartDto
    {
        public long UserId { get; set; }
        // Có thể thêm các thông tin khác nếu cần
    }
}
