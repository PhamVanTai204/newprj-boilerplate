
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using CloudinaryDotNet;
using Microsoft.EntityFrameworkCore;
using newprj.Entities;  // Đảm bảo nhập đúng namespace chứa class Product
using newprj.Products;
using newprj.Products.Dtos;
using NuGet.Protocol.Plugins;

namespace newprj.Products
{
    public class ProductAppService :
        AsyncCrudAppService<Product, ProductDto, int, PagedProductResultRequetstDto, CreateProductDto, UpdateProductDto>, IProductAppService
    {

        public ProductAppService(IRepository<Product, int> productRepository) : base(productRepository)
        {

        }
        public async Task<bool> UpdateMultipleProductsAsync(List<UpdateProductQuantityDto> products)
        {
            if (products == null || !products.Any())
                throw new UserFriendlyException("Danh sách sản phẩm không hợp lệ!");

            // Lấy danh sách ID sản phẩm cần cập nhật
            var productIds = products.Select(p => p.Id).ToList();

            // Lấy tất cả sản phẩm từ database một lần
            var productList = await Repository.GetAllListAsync(p => productIds.Contains(p.Id));

            foreach (var product in productList)
            {
                var productDto = products.FirstOrDefault(p => p.Id == product.Id);
                if (productDto != null)
                {
                    if (productDto.StockQuantity < 0)
                        throw new UserFriendlyException($"Số lượng sản phẩm ID {productDto.Id} không hợp lệ!");

                    product.StockQuantity = productDto.StockQuantity;
                }
            }

            await CurrentUnitOfWork.SaveChangesAsync(); // Lưu thay đổi một lần duy nhất
            return true;
        }
        public override async Task<PagedResultDto<ProductDto>> GetAllAsync(PagedProductResultRequetstDto input)
        {
            var allProducts = await Repository.GetAllListAsync();

            var query = from product in allProducts
                        where string.IsNullOrWhiteSpace(input.Keyword) || product.Name.Contains(input.Keyword)
                        select product;

            // Đếm tổng số bản ghi sau khi lọc
            var totalCount = query.Count();

            // Sắp xếp và phân trang
            var sortedQuery = query.AsQueryable().OrderBy(input.Sorting ?? "Name asc")
                                        .Skip(input.SkipCount)
                                        .Take(input.MaxResultCount)
                                        .ToList();

            var productDtos = ObjectMapper.Map<List<ProductDto>>(sortedQuery);

            return new PagedResultDto<ProductDto>(totalCount, productDtos);
        }

        //public override async Task<PagedResultDto<ProductDto>> GetAllAsync(PagedProductResultRequetstDto input)
        //{
        //    // lấy toàn bộ dữ liệu từ repositoryv
        //    var allProduct = await Repository.GetAllAsync();
        //    //ánh sạ dữ liệu từ thực thể sang dto 
        //    var productDtos = ObjectMapper.Map<List<ProductDto>>(allProduct);
        //    return new PagedResultDto<ProductDto>(productDtos.Count, productDtos);
        //}

        public override Task<ProductDto> CreateAsync(CreateProductDto input)
        {
            return base.CreateAsync(input);
        }

        public async Task<PagedResultDto<ProductDto>> GetDataSearch(string keyWord)
        {
            var query = from product in await Repository.GetAllAsync()
                        where product.Name.Contains(keyWord)
                        select product;
            var productDtos = ObjectMapper.Map<List<ProductDto>>(query);
            return new PagedResultDto<ProductDto>(productDtos.Count, productDtos);
        }
    }
}
