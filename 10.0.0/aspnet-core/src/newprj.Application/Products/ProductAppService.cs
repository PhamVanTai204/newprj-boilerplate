
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using CloudinaryDotNet;
using Microsoft.EntityFrameworkCore;
using newprj.Authorization;
using newprj.Entities;  // Đảm bảo nhập đúng namespace chứa class Product
using newprj.Products;
using newprj.Products.Dtos;
using NuGet.Protocol.Plugins;
using Microsoft.Extensions.Configuration;
using System.Data;           
using Dapper;
using Microsoft.Data.SqlClient;
using NuGet.Protocol;
namespace newprj.Products
{
    public class ProductAppService :
        AsyncCrudAppService<Product, ProductDto, int, PagedProductResultRequetstDto, CreateProductDto, UpdateProductDto>, IProductAppService
    {
        private readonly string _connectionString;
        public ProductAppService(IRepository<Product, int> productRepository, IConfiguration configuration) : base(productRepository)
        {
            _connectionString = configuration.GetConnectionString("Default");

        }  
          public override async Task<PagedResultDto<ProductDto>> GetAllAsync(PagedProductResultRequetstDto input)
        {
            //kết nối tới db
           using var connection = new SqlConnection(_connectionString);
            ///tạo đối tượng dapper, đủ để chứa ds tham số khi gọi sp hoặc sql 
            var paramater = new DynamicParameters();
            paramater.Add("@KEYWORD", input.Keyword, DbType.String);
            paramater.Add("@SORTING", input.Sorting, DbType.String);
            paramater.Add("@SKIPCOUNT", input.SkipCount, DbType.Int32);
            paramater.Add("@MAXRESULTCOUNT", input.MaxResultCount, DbType.Int32);
            paramater.Add("@TOTALCOUNT", dbType: DbType.Int32, direction: ParameterDirection.Output);
            //output thì vẫn phải thêm với kiểu trên 

            // sau khi tạo biến thì gọi procedure 
            var productDtos =  (await
                connection.QueryAsync<ProductDto>("SP_GETALL_PRODUCTS", paramater, commandType: CommandType.StoredProcedure)).ToList();
            // khi gọi procedure xong thì  sử lý biến nếu có 
            // ở đây là ta cần lấy biến totalCount từ kết quả trả về
            var totalCount = paramater.Get<int>("@TOTALCOUNT");



           return new PagedResultDto<ProductDto>(totalCount, productDtos);
        }
        public override async Task<ProductDto> GetAsync(EntityDto<int> input)
        {
            // tạo đổi tượng Dapper 
            using var connection = new SqlConnection(_connectionString);
            // tạo paramaters để chứa biến 
            var paramaters = new DynamicParameters();
            paramaters.Add("@PRD_ID", input.Id, DbType.Int32);

            var product = await 
                connection.QueryFirstOrDefaultAsync<ProductDto>("SP_GET_PRD_BYID", paramaters, commandType: CommandType.StoredProcedure);
            // Kiểm tra nếu không tìm thấy sản phẩm
            if (product == null)
            {
                throw new UserFriendlyException("Sản phẩm không tồn tại!");
            }
            return ObjectMapper.Map<ProductDto>(product);
            //return MapToEntityDto(product);
            //return await base.GetAsync(input);
            }

            [AbpAuthorize(PermissionNames.Pages_Products_Create)]
        public override async Task<ProductDto> CreateAsync(CreateProductDto input)
        {
            // tạo đối tượng của Dapper, đủ để chứa danh sách tham số khi gọi SP hoặc sql 
            using var connection = new SqlConnection(_connectionString);
            var paramaters = new DynamicParameters();
            paramaters.Add("@maSP", input.maSP, DbType.String);
            paramaters.Add("@RESULT", dbType: DbType.Int32, direction: ParameterDirection.Output);
            
           
                // gọi procedure 
            await connection.ExecuteAsync("SP_CHECK_MASP",  paramaters, commandType: CommandType.StoredProcedure);

            if (paramaters.Get<int>("@RESULT") == 1)
            {
                throw new UserFriendlyException("mã sản phẩm đã tồn tại");

            }


            return await base.CreateAsync(input);
        }


        public async Task<PagedResultDto<ProductDto>> GetDataSearch(string keyWord)
        {
            var query = from product in await Repository.GetAllAsync()
                        where product.Name.Contains(keyWord)

                        select product 
                        ;
            var productDtos = ObjectMapper.Map<List<ProductDto>>(query);
            return new PagedResultDto<ProductDto>(productDtos.Count, productDtos);
        }
    }
}
