using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using newprj.Entities;

namespace newprj.Invoices.Dtos
{
    [AutoMapTo(typeof(Invoice))]
    public class UpdateInvoice: EntityDto<int>
    {
        public InvoiceStatus Status { get; set; } // Trạng thái mặc định là Đã đặt hàng

    }
}
