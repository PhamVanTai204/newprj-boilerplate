using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using newprj.Invoices.Dtos;

namespace newprj.Invoices
{
    public interface IInvoiceAppSevice: IAsyncCrudAppService<InvoiceDto, int, PagedInvoiceResultRequestDto, CreateInvoiceDto, UpdateInvoice>
    {
    }
}
