using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Dependency;
using newprj.Authentication.JwtBearer;
using newprj.Configuration;
using newprj.EntityFrameworkCore;
using newprj.Identity;
using newprj.Web.Resources;
using newprj.Web.Startup;
using Castle.MicroKernel.Registration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;

namespace newprj.Web.Tests;

public class Startup
{
    private readonly IConfigurationRoot _appConfiguration;

    public Startup(IWebHostEnvironment env)
    {
        _appConfiguration = env.GetAppConfiguration();
    }

    public IServiceProvider ConfigureServices(IServiceCollection services)
    {
        services.AddEntityFrameworkInMemoryDatabase();

        services.AddMvc();

        IdentityRegistrar.Register(services);
        AuthConfigurer.Configure(services, _appConfiguration);

        services.AddScoped<IWebResourceManager, WebResourceManager>();

        //Configure Abp and Dependency Injection
        return services.AddAbp<newprjWebTestModule>(options =>
        {
            options.SetupTest();
        });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
    {
        UseInMemoryDb(app.ApplicationServices);

        app.UseAbp(); //Initializes ABP framework.

        app.UseExceptionHandler("/Error");

        app.UseStaticFiles();
        app.UseRouting();

        app.UseAuthentication();

        app.UseJwtTokenMiddleware();

        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllerRoute("default", "{controller=Home}/{action=Index}/{id?}");
        });
    }

    private void UseInMemoryDb(IServiceProvider serviceProvider)
    {
        var builder = new DbContextOptionsBuilder<newprjDbContext>();
        builder.UseInMemoryDatabase(Guid.NewGuid().ToString()).UseInternalServiceProvider(serviceProvider);
        var options = builder.Options;

        var iocManager = serviceProvider.GetRequiredService<IIocManager>();
        iocManager.IocContainer
            .Register(
                Component.For<DbContextOptions<newprjDbContext>>()
                    .Instance(options)
                    .LifestyleSingleton()
            );
    }
}