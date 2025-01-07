using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using newprj.Products.Dtos;

namespace newprj.Products
{
    public interface IProductAppService : IAsyncCrudAppService<ProductDto,int,PagedProductResultRequetstDto,CreateProductDto,UpdateProductDto>
    {
        
    }

}
