using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using newprj.Products.Dtos;

namespace newprj.Products
{
    public interface IProductAppService : IApplicationService
    {
        Task<List<ProductDto>> GetAllAsync();
        Task<ProductDto> GetAsync(int id);
        Task<ProductDto> CreateAsync(CreateProductDto input);
        Task<ProductDto> UpdateAsync(UpdateProductDto input);
        Task DeleteAsync(int id);
    }

}
