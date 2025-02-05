using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;

namespace newprj.Carts.Dtos
{
    public class PagedCartResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; } // Tìm kiếm theo từ khóa (nếu có)
    }
}
