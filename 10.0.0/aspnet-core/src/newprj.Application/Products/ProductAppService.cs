using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using CloudinaryDotNet;
using newprj.Entities;  // Đảm bảo nhập đúng namespace chứa class Product
using newprj.Products;
using newprj.Products.Dtos;
using NuGet.Protocol.Plugins;

namespace newprj.Products
{
    public class ProductAppService :
        AsyncCrudAppService<Product, ProductDto, int, PagedProductResultRequetstDto, CreateProductDto, UpdateProductDto>, IProductAppService
    {
        private readonly IRepository<Product, int> _productRepository;
        Cloudinary cloudinary;
        public ProductAppService(IRepository<Product, int> productRepository) : base(productRepository)
        {

            _productRepository = productRepository;
        }

        public override async Task<PagedResultDto<ProductDto>> GetAllAsync(PagedProductResultRequetstDto input)
        {
            // lấy toàn bộ dữ liệu từ repositoryv
            var allProduct = await _productRepository.GetAllAsync();
            //ánh sạ dữ liệu từ thực thể sang dto 
            var productDtos = ObjectMapper.Map<List<ProductDto>>(allProduct);
            return new PagedResultDto<ProductDto>(productDtos.Count, productDtos);
        }

        public override Task<ProductDto> CreateAsync(CreateProductDto input)
        {
            return base.CreateAsync(input);
        }

        public async Task<PagedResultDto<ProductDto>> GetDataSearch(string keyWord)
        {
            var query = from product in await _productRepository.GetAllAsync()
                        where product.Name.Contains(keyWord)
                        select product;
            var productDtos = ObjectMapper.Map<List<ProductDto>>(query);
            return new PagedResultDto<ProductDto>(productDtos.Count, productDtos);
        }
    }
}
