using Abp.Authorization;
using Abp.Runtime.Session;
using newprj.Configuration.Dto;
using System.Threading.Tasks;

namespace newprj.Configuration;

[AbpAuthorize]
public class ConfigurationAppService : newprjAppServiceBase, IConfigurationAppService
{
    public async Task ChangeUiTheme(ChangeUiThemeInput input)
    {
        await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
    }
}
