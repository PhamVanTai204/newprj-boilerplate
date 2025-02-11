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
    public DbSet<Invoice> Invoices { get; set; }
    public DbSet<InvoiceItem> InvoiceItems { get; set; }
   
    public newprjDbContext(DbContextOptions<newprjDbContext> options)
        : base(options)
    {
    }
   



}
