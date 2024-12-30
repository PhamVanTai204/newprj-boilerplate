using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Domain.Repositories;

namespace newprj.Products
{
    public class ProductAppService : CrudAppService<Product, ProductDto>
    {
        public ProductAppService(IRepository<Product, int> repository) : base(repository)
        {
        }
    }
}
