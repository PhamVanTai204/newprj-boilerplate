﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using newprj.Entities;

namespace newprj.InvoiceItems.Dtos
{
    [AutoMapTo(typeof(InvoiceItem))]
    public class UpdateInvoiceItemDto: EntityDto<int>
    {
        public int Quantity { get; set; } // Số lượng sản phẩm

    }
}
