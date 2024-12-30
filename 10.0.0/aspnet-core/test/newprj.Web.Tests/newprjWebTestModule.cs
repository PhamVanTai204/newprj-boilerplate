using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using newprj.EntityFrameworkCore;
using newprj.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace newprj.Web.Tests;

[DependsOn(
    typeof(newprjWebMvcModule),
    typeof(AbpAspNetCoreTestBaseModule)
)]
public class newprjWebTestModule : AbpModule
{
    public newprjWebTestModule(newprjEntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
    }

    public override void PreInitialize()
    {
        Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(newprjWebTestModule).GetAssembly());
    }

    public override void PostInitialize()
    {
        IocManager.Resolve<ApplicationPartManager>()
            .AddApplicationPartsIfNotAddedBefore(typeof(newprjWebMvcModule).Assembly);
    }
}