using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using newprj.Entities;  // Đảm bảo nhập đúng namespace chứa class Product
using newprj.Products;
using newprj.Products.Dtos;
using NuGet.Protocol.Plugins;

namespace newprj.Products
{
    public class ProductAppService : ApplicationService, IProductAppService
    {
        private readonly IRepository<Product, int> _productRepository;

        public ProductAppService(IRepository<Product, int> productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<List<ProductDto>> GetAllAsync()
        {
            var products = await _productRepository.GetAllListAsync();
            return ObjectMapper.Map<List<ProductDto>>(products) ;
        }

        public async Task<ProductDto> GetAsync(int id)
        {
            var product = await _productRepository.GetAsync(id);
            return ObjectMapper.Map<ProductDto>(product);
        }

        public async Task<ProductDto> CreateAsync(CreateProductDto input)
        {
            var product = ObjectMapper.Map<Product>(input);
            await _productRepository.InsertAsync(product);
            return new ProductDto();
        }

        public async Task<ProductDto> UpdateAsync(UpdateProductDto input)
        {
            var product = await _productRepository.GetAsync(input.Id);
            ObjectMapper.Map(input, product);
            await _productRepository.UpdateAsync(product);
           
            return new ProductDto();
        }

        public async Task DeleteAsync(int id)
        {
            await _productRepository.DeleteAsync(id);
        }

 
    }
}
