﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities.Auditing;

namespace newprj.Entities
{
    public class Product: FullAuditedEntity<int>
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string Description { get; set; }
        public string UrlImage { get; set; }
        public string masp { get; set; }
        public virtual ICollection<CartItem> CartItems { get; set; }
        
    }
}
