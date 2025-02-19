using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using AutoMapper.Internal.Mappers;
using Microsoft.EntityFrameworkCore;
using newprj.CartItems;
using newprj.CartItems.Dtos;
using newprj.Carts.Dtos;
using newprj.Entities;
using newprj.Products.Dtos;
using newprj.Users.Dto;

namespace newprj.Carts
{
    public class CartAppService :
       AsyncCrudAppService<Cart, CartDto, int, PagedCartResultRequestDto, CreateCartDto, UpdateCartDto>,
       ICartAppService
    {
        private readonly IRepository<Cart, int> _cartRepository;
        private readonly IRepository<CartItem, int> _cartItemRepository;
        private readonly CartItemAppService _cartItemAppService;


        public CartAppService(
            IRepository<Cart, int> cartRepository,
            IRepository<CartItem, int> cartItemRepository,
            CartItemAppService cartItemAppService
        ) : base(cartRepository)
        {
            _cartRepository = cartRepository;
            _cartItemRepository = cartItemRepository;
            _cartItemAppService = cartItemAppService;
        }

        /// <summary>
        /// Lấy giỏ hàng của người dùng
        /// </summary>
        public async Task<CartDto> GetCartByUserIdAsync(long userId)
        {
            var cart = await _cartRepository
              .GetAllIncluding(x => x.CartItems)
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (cart == null) return null;

            var cartDto = ObjectMapper.Map<CartDto>(cart);
            
            return cartDto;
        }

        public override async Task<PagedResultDto<CartDto>> GetAllAsync(PagedCartResultRequestDto input)
        {
            // Lấy toàn bộ dữ liệu giỏ hàng từ repository (bao gồm cả CartItems nếu có navigation property)
            var allCarts = await _cartRepository
                .GetAllIncluding(c => c.CartItems) // Đảm bảo lấy luôn CartItems
                .ToListAsync();

            // Ánh xạ dữ liệu từ entity sang DTO
            var cartDtos = ObjectMapper.Map<List<CartDto>>(allCarts);

            return new PagedResultDto<CartDto>(cartDtos.Count, cartDtos);
        }


        /// <summary>
        /// Tạo giỏ hàng mới cho người dùng
        /// </summary>
        public override async Task<CartDto> CreateAsync(CreateCartDto input)
        {
            var cart = new Cart
            {
                UserId = input.UserId,
             };

            var createdCart = await _cartRepository.InsertAsync(cart);
            return ObjectMapper.Map<CartDto>(createdCart);
        }
        public override async Task<CartDto> GetAsync(EntityDto<int> input)
        {
            // Lấy Cart theo ID và include luôn CartItems
            var cart = await _cartRepository
                .GetAllIncluding(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.Id == input.Id);

            if (cart == null)
            {
                throw new EntityNotFoundException(typeof(Cart), input.Id);
            }

            // Map sang DTO
            var cartDto = ObjectMapper.Map<CartDto>(cart);

            return cartDto;
        }

        internal async Task UpdateCartTotalPriceAsync(int cartId)
        {
            throw new NotImplementedException();// co the thaydd
        }
    }
}
