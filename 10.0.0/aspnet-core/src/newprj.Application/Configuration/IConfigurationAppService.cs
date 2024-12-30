using newprj.Configuration.Dto;
using System.Threading.Tasks;

namespace newprj.Configuration;

public interface IConfigurationAppService
{
    Task ChangeUiTheme(ChangeUiThemeInput input);
}
