using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using newprj.CartItems.Dtos;
using newprj.Carts.Dtos;

namespace newprj.CartItems
{
    public interface ICartItemAppService: IAsyncCrudAppService<CartItemDto, int, PagedCartItemResultRequestDto, CreateCartItemDto, UpdateCartItemDto>
    {

    }
}   
