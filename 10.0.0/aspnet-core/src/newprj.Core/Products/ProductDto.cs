using Abp.Application.Services.Dto;

namespace newprj.Products
{
    public class ProductDto : EntityDto<int>
    {
        public string Name { get; set; }
        public int Quantity { get; set; }
    }
}
