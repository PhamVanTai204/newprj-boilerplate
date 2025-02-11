
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq;
using newprj.CartItems.Dtos;
using newprj.Carts;
using newprj.Entities;

namespace newprj.CartItems
{
    public class CartItemAppService: AsyncCrudAppService<CartItem, CartItemDto, int, PagedCartItemResultRequestDto, CreateCartItemDto, UpdateCartItemDto>,  ICartItemAppService
    {
        private readonly IRepository<CartItem, int> _cartItemRepository;
      //  private readonly ICartAppService _cartAppService;
        public CartItemAppService(
            IRepository<CartItem, int> cartItemRepository
      //      ICartAppService cartAppService  // Dùng interface thay vì class cụ thể
            ) : base(cartItemRepository) 
        {
            _cartItemRepository = cartItemRepository;
         //    _cartAppService = cartAppService;

        }
        public override async Task<CartItemDto> CreateAsync(CreateCartItemDto input)
        {
            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            var existingCartItem = await _cartItemRepository.FirstOrDefaultAsync(
                ci => ci.CartId == input.CartId && ci.ProductId == input.ProductId
            );

            CartItem cartItem;

            if (existingCartItem != null)
            {
                // Nếu sản phẩm đã có, tăng số lượng
                existingCartItem.Quantity += input.Quantity;
                cartItem = await _cartItemRepository.UpdateAsync(existingCartItem);
            }
            else
            {
                // Nếu sản phẩm chưa có, thêm mới
                cartItem = new CartItem
                {
                    CartId = input.CartId,
                    Name = input.Name,
                    Price = input.Price,
                    UrlImage = input.UrlImage,
                    ProductId = input.ProductId,
                    Quantity = input.Quantity
                };

                await _cartItemRepository.InsertAsync(cartItem);

                // Truy vấn lại để lấy thông tin chính xác (tránh lỗi null)
                cartItem = await _cartItemRepository.FirstOrDefaultAsync(
                    ci => ci.CartId == input.CartId && ci.ProductId == input.ProductId
                );
            }

           
            // Trả về DTO sau khi thêm/cập nhật
            return ObjectMapper.Map<CartItemDto>(cartItem);
        }

        public override async Task<CartItemDto> UpdateAsync(UpdateCartItemDto input)
        {
            var cartItem = await _cartItemRepository.GetAsync(input.Id);
            ObjectMapper.Map(input, cartItem);
            await _cartItemRepository.UpdateAsync(cartItem);
            return ObjectMapper.Map<CartItemDto>(cartItem);
        }

        public override async Task<PagedResultDto<CartItemDto>> GetAllAsync(PagedCartItemResultRequestDto input)
        {
            var query = _cartItemRepository.GetAll();
            var totalCount = await AsyncQueryableExecuter.CountAsync(query);
            var items = await AsyncQueryableExecuter.ToListAsync(query);

            return new PagedResultDto<CartItemDto>(
                totalCount,
                ObjectMapper.Map<List<CartItemDto>>(items)
            );
        }


    }
}
