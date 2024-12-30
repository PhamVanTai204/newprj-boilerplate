using Abp.Application.Services;
using newprj.Sessions.Dto;
using System.Threading.Tasks;

namespace newprj.Sessions;

public interface ISessionAppService : IApplicationService
{
    Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
}
