using Abp.Zero.EntityFrameworkCore;
using newprj.Authorization.Roles;
using newprj.Authorization.Users;
using newprj.MultiTenancy;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using newprj.Entities;
namespace newprj.EntityFrameworkCore;

public class newprjDbContext : AbpZeroDbContext<Tenant, Role, User, newprjDbContext>
{
    /* Define a DbSet for each entity of the application */
    public DbSet<Product> Products { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public newprjDbContext(DbContextOptions<newprjDbContext> options)
        : base(options)
    {
    }
    //protected override void OnModelCreating(ModelBuilder modelBuilder)
    //{
    //    // Cart ↔ CartItems (1-n)
    //    //modelBuilder.Entity<Cart>()
    //    //    .HasMany(c => c.Items)
    //    //    .WithOne(ci => ci.Cart)
    //    //    .HasForeignKey(ci => ci.CartId);

    //    //// Order ↔ OrderItems (1-n)
        
    //    //// Product ↔ CartItems (1-n)
    //    //modelBuilder.Entity<Product>()
    //    //    .HasMany(p => p.CartItems)
    //    //    .WithOne(ci => ci.Product)
    //    //    .HasForeignKey(ci => ci.ProductId);

    //    // Product ↔ OrderItems (1-n)
        

    //    base.OnModelCreating(modelBuilder);
    //}



}
