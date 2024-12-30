using Abp.Application.Services;
using newprj.MultiTenancy.Dto;

namespace newprj.MultiTenancy;

public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
{
}

