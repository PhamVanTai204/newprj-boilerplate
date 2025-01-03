//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using Abp.AspNetCore.Mvc.Controllers;
//using Microsoft.AspNetCore.Mvc;
//using newprj.Products.Dtos;
//using newprj.Products;

//namespace newprj.Controllers
//{
//    [Route("api/[controller]")]
//    public class ProductController : AbpController
//    {
//        private readonly IProductAppService _productAppService;

//        public ProductController(IProductAppService productAppService)
//        {
//            _productAppService = productAppService;
//        }

//        [HttpGet]
//        public async Task<List<ProductDto>> GetAllAsync()
//        {
//            return await _productAppService.GetAllAsync();
//        }

//        [HttpGet("{id}")]
//        public async Task<ProductDto> GetAsync(int id)
//        {
//            return await _productAppService.GetAsync(id);
//        }

//        [HttpPost]
//        public async Task<ProductDto> CreateAsync(CreateProductDto input)
//        {
//            return await _productAppService.CreateAsync(input);
//        }

//        [HttpPut]
//        public async Task<ProductDto> UpdateAsync(ProductDto input)
//        {
//            return await _productAppService.UpdateAsync(input);
//        }

//        [HttpDelete("{id}")]
//        public async Task DeleteAsync(int id)
//        {
//            await _productAppService.DeleteAsync(id);
//        }
//    }

//}
