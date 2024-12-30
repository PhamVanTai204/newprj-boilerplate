using Abp.Modules;
using Abp.Reflection.Extensions;
using newprj.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace newprj.Web.Host.Startup
{
    [DependsOn(
       typeof(newprjWebCoreModule))]
    public class newprjWebHostModule : AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public newprjWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(newprjWebHostModule).GetAssembly());
        }
    }
}
