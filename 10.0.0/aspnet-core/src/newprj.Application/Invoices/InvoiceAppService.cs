using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.EntityFrameworkCore.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
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
            input.Normalize();

            var query = _invoiceRepository.GetAll()
                .Include(i => i.InvoiceItems)
                .Include(i => i.User)
                .WhereIf(!string.IsNullOrWhiteSpace(input.Keyword),
                    i => i.Id.ToString().Contains(input.Keyword) || i.ShippingAddress.Contains(input.Keyword));

            var totalCount = await query.CountAsync();
            var invoices = await query
                .OrderBy(input.Sorting)
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
                .ToListAsync();

            return new PagedResultDto<InvoiceDto>(
                totalCount,
                ObjectMapper.Map<List<InvoiceDto>>(invoices)
            );
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
        public override async Task<InvoiceDto> CreateAsync(CreateInvoiceDto input)
        {
            // Lấy danh sách ProductId từ InvoiceItems
            var productIds = input.InvoiceItems.Select(i => i.ProductId).ToList();

            // Lấy danh sách sản phẩm từ database
            var products = await Repository.GetDbContext().Set<Product>()
                .Where(p => productIds.Contains(p.Id))
                .ToListAsync();

            // Kiểm tra số lượng hàng trong kho
            foreach (var item in input.InvoiceItems)
            {
                var product = products.FirstOrDefault(p => p.Id == item.ProductId);
                if (product == null)
                {
                    throw new UserFriendlyException($"Sản phẩm với ID {item.ProductId} không tồn tại!");
                }
                if (product.StockQuantity < item.Quantity)
                {
                    throw new UserFriendlyException($"Sản phẩm {product.Name} không đủ số lượng! Chỉ còn {product.StockQuantity} trong kho.");
                }
            }

            // Nếu tất cả sản phẩm đủ hàng, tiến hành trừ số lượng
            foreach (var item in input.InvoiceItems)
            {
                var product = products.First(p => p.Id == item.ProductId);
                product.StockQuantity -= item.Quantity;
            }

            // Cập nhật sản phẩm vào database
            await Repository.GetDbContext().SaveChangesAsync();

            // Tạo hóa đơn sau khi cập nhật thành công số lượng sản phẩm
            var invoice = ObjectMapper.Map<Invoice>(input);
            await Repository.InsertAsync(invoice);

            return ObjectMapper.Map<InvoiceDto>(invoice);
        }

        //lấy hóa đơn by UserId 
        public async Task<PagedResultDto<InvoiceDto>> GetInvoiceByUserID(long userId, int skipCount = 0, int maxResultCount = 10)
        {
            var query = _invoiceRepository
                .GetAllIncluding(c => c.InvoiceItems)
                .Where(x => x.UserId == userId); // Điều kiện tìm theo UserId

            // Đếm tổng số hóa đơn
            var totalCount = await query.CountAsync();

            // Lấy danh sách hóa đơn có phân trang
            var allInvoices = await query
                .OrderByDescending(x => x.CreationTime) // Sắp xếp theo thời gian tạo
                .Skip(skipCount)
                .Take(maxResultCount)
                .ToListAsync();

            // Ánh xạ sang DTO
            var invoiceDtos = ObjectMapper.Map<List<InvoiceDto>>(allInvoices);

            return new PagedResultDto<InvoiceDto>(totalCount, invoiceDtos);
        }

    }
}
