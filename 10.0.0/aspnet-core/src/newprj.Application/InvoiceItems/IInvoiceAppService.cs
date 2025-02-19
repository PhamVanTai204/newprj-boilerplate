using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using newprj.InvoiceItems.Dtos;
using newprj.Invoices.Dtos;

namespace newprj.InvoiceItems
{
    public interface IInvoiceAppService: IAsyncCrudAppService<InvoiceItemDto, int, PagedInvoiceItemResultRequestDto, CreateInvoiceItemDto, UpdateInvoiceItemDto>
    {
    }
}
