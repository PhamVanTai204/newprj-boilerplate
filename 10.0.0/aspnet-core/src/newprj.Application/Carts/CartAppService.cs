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
                TotalPrice = 0
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


        /// <summary>
        /// Thêm sản phẩm vào giỏ hàng
        /// </summary>
        //public async Task AddProductToCartAsync(CreateCartItemDto input)
        //{
        //    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        //    var existingCartItem = await _cartItemRepository.FirstOrDefaultAsync(
        //        ci => ci.CartId == input.CartId && ci.ProductId == input.ProductId
        //    );

        //    if (existingCartItem != null)
        //    {
        //        // Nếu sản phẩm đã có, tăng số lượng
        //        existingCartItem.Quantity += input.Quantity;
        //        await _cartItemRepository.UpdateAsync(existingCartItem);
        //    }
        //    else
        //    {
        //        // Nếu sản phẩm chưa có, thêm mới
        //        var cartItem = new CartItem
        //        {
        //            CartId = input.CartId,
        //            ProductId = input.ProductId,
        //            Quantity = input.Quantity
        //        };

        //        await _cartItemRepository.InsertAsync(cartItem);
        //    }

        //    // Cập nhật tổng giá tiền của giỏ hàng khi này 
        //    await UpdateCartTotalPriceAsync(input.CartId);
        //}


        /// <summary>
        /// Xóa sản phẩm khỏi giỏ hàng
        /// </summary>
        //public async Task RemoveProductFromCartAsync(int cartItemId)
        //{
        //    var cartItem = await _cartItemRepository.GetAsync(cartItemId);
        //    int cartId = cartItem.CartId;

        //    await _cartItemRepository.DeleteAsync(cartItemId);
        //    await UpdateCartTotalPriceAsync(cartId);
        //}

        /// <summary>
        /// Cập nhật tổng giá tiền của giỏ hàng
        /// </summary>
        public async Task UpdateCartTotalPriceAsync(EntityDto<int> cartId)
{
    // Lấy thông tin giỏ hàng
    var cartDto = await GetAsync(cartId);
    if (cartDto == null)
    {
        throw new Exception($"Cart with ID {cartId.Id} not found.");
    }

    // Lấy tất cả cart items thuộc giỏ hàng này
    var cartItemsResult = await _cartItemAppService.GetAllAsync(new PagedCartItemResultRequestDto());
    var cartItems = cartItemsResult.Items.Where(ci => ci.CartId == cartId.Id).ToList();

    if (!cartItems.Any())
    {
        throw new Exception($"Cart items for cart ID {cartId.Id} not found.");
    }

    decimal totalPrice = 0;

    foreach (var cartItem in cartItems)
    {
        // Truy vấn sản phẩm để lấy giá
        var product = await _cartItemRepository.GetAll()
            .Where(p => p.ProductId == cartItem.ProductId)
            .Select(p => new { p.ProductId, p.Product.Price }) // Chỉ lấy thông tin cần thiết
            .FirstOrDefaultAsync();

        if (product != null)
        {
            totalPrice += cartItem.Quantity * product.Price;
        }
    }

    // Cập nhật tổng giá tiền vào giỏ hàng
    var cart = await _cartRepository.GetAsync(cartId.Id);
    cart.TotalPrice = totalPrice;
    await _cartRepository.UpdateAsync(cart);
}

        internal async Task UpdateCartTotalPriceAsync(int cartId)
        {
            throw new NotImplementedException();
        }
    }
}
