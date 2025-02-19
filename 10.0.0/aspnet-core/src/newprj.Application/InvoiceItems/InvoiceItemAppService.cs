using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using newprj.Entities;
using newprj.InvoiceItems.Dtos;
using newprj.Invoices.Dtos;

namespace newprj.InvoiceItems
{
    public class InvoiceItemAppService: AsyncCrudAppService<InvoiceItem, InvoiceItemDto,int, PagedInvoiceItemResultRequestDto, CreateInvoiceItemDto, UpdateInvoiceItemDto>, IInvoiceAppService
    {

        private readonly IRepository<InvoiceItem, int> _invoiceItemRepository;
        //  private readonly ICartAppService _cartAppService;
        public InvoiceItemAppService(
            IRepository<InvoiceItem, int> InvoiceItemRepository
            //      ICartAppService cartAppService  // Dùng interface thay vì class cụ thể
            ) : base(InvoiceItemRepository)
        {
            _invoiceItemRepository = InvoiceItemRepository;
            //    _cartAppService = cartAppService;

        }
    }
}
