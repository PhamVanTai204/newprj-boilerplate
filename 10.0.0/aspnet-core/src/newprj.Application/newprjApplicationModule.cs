using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using newprj.Authorization;

namespace newprj;

[DependsOn(
    typeof(newprjCoreModule),
    typeof(AbpAutoMapperModule))]
public class newprjApplicationModule : AbpModule
{
    public override void PreInitialize()
    {
        Configuration.Authorization.Providers.Add<newprjAuthorizationProvider>();
    }

    public override void Initialize()
    {
        var thisAssembly = typeof(newprjApplicationModule).GetAssembly();

        IocManager.RegisterAssemblyByConvention(thisAssembly);

        Configuration.Modules.AbpAutoMapper().Configurators.Add(
            // Scan the assembly for classes which inherit from AutoMapper.Profile
            cfg => cfg.AddMaps(thisAssembly)
        );

    }
}
