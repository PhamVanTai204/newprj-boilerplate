﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using newprj.Products.Dtos;

namespace newprj.Products
{
    public interface IProductAppService : IAsyncCrudAppService<ProductDto,int,PagedProductResultRequetstDto,CreateProductDto,UpdateProductDto>
    {
        public Task<PagedResultDto<ProductDto>> GetDataSearch(string keyWord);

     }

}
