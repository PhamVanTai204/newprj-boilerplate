using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.AutoMapper;
using newprj.Entities;

namespace newprj.Products.Dtos
{
    [AutoMapTo(typeof(Product))]

    public class CreateProductDto
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string Description { get; set; }
        public string UrlImage { get; set; }
        public string maSP { get; set; }


    }
}
