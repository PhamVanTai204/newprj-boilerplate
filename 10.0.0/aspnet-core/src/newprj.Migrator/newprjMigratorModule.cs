using Abp.Events.Bus;
using Abp.Modules;
using Abp.Reflection.Extensions;
using newprj.Configuration;
using newprj.EntityFrameworkCore;
using newprj.Migrator.DependencyInjection;
using Castle.MicroKernel.Registration;
using Microsoft.Extensions.Configuration;

namespace newprj.Migrator;

[DependsOn(typeof(newprjEntityFrameworkModule))]
public class newprjMigratorModule : AbpModule
{
    private readonly IConfigurationRoot _appConfiguration;

    public newprjMigratorModule(newprjEntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbSeed = true;

        _appConfiguration = AppConfigurations.Get(
            typeof(newprjMigratorModule).GetAssembly().GetDirectoryPathOrNull()
        );
    }

    public override void PreInitialize()
    {
        Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
            newprjConsts.ConnectionStringName
        );

        Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
        Configuration.ReplaceService(
            typeof(IEventBus),
            () => IocManager.IocContainer.Register(
                Component.For<IEventBus>().Instance(NullEventBus.Instance)
            )
        );
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(newprjMigratorModule).GetAssembly());
        ServiceCollectionRegistrar.Register(IocManager);
    }
}
