using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using newprj.CartItems.Dtos;
using newprj.Carts.Dtos;

namespace newprj.Carts
{
    public interface ICartAppService : IAsyncCrudAppService<
        CartDto,
        int,
        PagedCartResultRequestDto,
        CreateCartDto,
        UpdateCartDto>
    {
        //Task<CartDto> GetCartByUserIdAsync(long userId);
        // Task RemoveProductFromCartAsync(int cartItemId);
        //Task UpdateCartTotalPriceAsync(int cartId);
    }
}
