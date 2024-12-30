using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace newprj.Controllers
{
    public abstract class newprjControllerBase : AbpController
    {
        protected newprjControllerBase()
        {
            LocalizationSourceName = newprjConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
