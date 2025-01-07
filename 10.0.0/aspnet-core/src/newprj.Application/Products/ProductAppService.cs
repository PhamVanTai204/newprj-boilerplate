using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using newprj.Entities;  // Đảm bảo nhập đúng namespace chứa class Product
using newprj.Products;
using newprj.Products.Dtos;
using NuGet.Protocol.Plugins;

namespace newprj.Products
{
    public class ProductAppService :          // cần kế thừa từ AsyncCrudAppService để trả về đúng kiểu dl  thì mới có thể kết nối bên fe 
                                              // CUE dto 3 cái này cần phải có map,     [AutoMapTo(typeof(Product))] khi cần  ánh sạ lớp đích sang lớp nguồn
                                              //  AutoMapFrom khi muốn ánh xạ dữ liệu từ đối tượng của lớp nguồn (source class) vào đối tượng của lớp đích (destination class).

        AsyncCrudAppService<Product,ProductDto,int, PagedProductResultRequetstDto, CreateProductDto, UpdateProductDto>, IProductAppService
    {
        private readonly IRepository<Product, int> _productRepository;
        public ProductAppService(IRepository<Product, int> productRepository) : base(productRepository)
        {
            _productRepository = productRepository;
        }

        public override async Task<PagedResultDto<ProductDto>> GetAllAsync(PagedProductResultRequetstDto input)
        {
            return await base.GetAllAsync(input);
        }

        public override Task<ProductDto> CreateAsync(CreateProductDto input)
        {
            return base.CreateAsync(input);
        }

    }
}
