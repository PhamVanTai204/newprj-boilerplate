using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using newprj.Entities;

namespace newprj.Products.Dtos
{
    [AutoMapTo(typeof(Product))]
    public class UpdateProductDto : EntityDto<int>
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
    }
}
