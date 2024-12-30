using Microsoft.EntityFrameworkCore;
using System.Data.Common;

namespace newprj.EntityFrameworkCore;

public static class newprjDbContextConfigurer
{
    public static void Configure(DbContextOptionsBuilder<newprjDbContext> builder, string connectionString)
    {
        builder.UseSqlServer(connectionString);
    }

    public static void Configure(DbContextOptionsBuilder<newprjDbContext> builder, DbConnection connection)
    {
        builder.UseSqlServer(connection);
    }
}
