using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using newprj.Entities;
using newprj.Invoices.Dtos;

namespace newprj.Invoices
{
    public class InvoiceAppService: AsyncCrudAppService<Invoice, InvoiceDto, int, PagedInvoiceResultRequestDto, CreateInvoiceDto, UpdateInvoice>, IInvoiceAppSevice
    {
        private readonly IRepository<Invoice, int> _invoiceRepository;
        //  private readonly ICartAppService _cartAppService;
        public InvoiceAppService(
            IRepository<Invoice, int> InvoiceRepository
            //      ICartAppService cartAppService  // Dùng interface thay vì class cụ thể
            ) : base(InvoiceRepository)
        {
            _invoiceRepository = InvoiceRepository;
            //    _cartAppService = cartAppService;

        }
        public override async Task<PagedResultDto<InvoiceDto>> GetAllAsync(PagedInvoiceResultRequestDto input)
        {
            var allInvoice = await _invoiceRepository.GetAllIncluding(c => c.InvoiceItems).ToListAsync();
            // ánh sạ dữ liệu qua dto 
            var invoiceDtos = ObjectMapper.Map<List<InvoiceDto>>(allInvoice);
            return new PagedResultDto<InvoiceDto>(invoiceDtos.Count, invoiceDtos);
        }
        public override async Task<InvoiceDto> GetAsync(EntityDto<int> input )
        {
            var invoice = await _invoiceRepository
                .GetAllIncluding(c=> c.InvoiceItems)
                .FirstOrDefaultAsync(x=> x.Id ==input.Id);
            if(invoice == null)
            {
                return null;
            }
            var invoiceDto = ObjectMapper.Map<InvoiceDto>(invoice); 
            return invoiceDto;
        }
        //lấy hóa đơn by UserId 
        public async Task<List<InvoiceDto>> GetInvoiceByUserID (long userId)
        {
            var allinvoice = await _invoiceRepository
                .GetAllIncluding(c=> c.InvoiceItems)
                 
                .Where(x => x.UserId == userId)  // Điều kiện cần tìm
                .ToListAsync();  // Lấy tất cả các phần tử thỏa mãn điều kiện
            // ánh sạ như get all 
            var invoiceDtos = ObjectMapper.Map<List<InvoiceDto>>(allinvoice);
            return invoiceDtos;
         }
    }
}
