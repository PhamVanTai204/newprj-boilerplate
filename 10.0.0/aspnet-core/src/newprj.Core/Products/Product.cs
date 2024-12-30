using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities;

namespace newprj.Products
{
    public class Product :Entity<int>
    {
        public  string Name { get; set; }
        public int Quantity { get; set; }
    }
}
