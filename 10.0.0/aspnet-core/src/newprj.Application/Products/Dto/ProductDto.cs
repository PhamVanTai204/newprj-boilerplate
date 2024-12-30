using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;

namespace newprj.Products.Dto
{
    public class ProductDto : EntityDto<int>
    {
        [AutoMapFrom(typeof(Product))]
        public string Name { get; set; }
        public int Quantity { get; set; }
    }
}
