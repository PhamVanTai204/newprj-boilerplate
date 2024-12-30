using Abp.Authorization;
using newprj.Authorization.Roles;
using newprj.Authorization.Users;

namespace newprj.Authorization;

public class PermissionChecker : PermissionChecker<Role, User>
{
    public PermissionChecker(UserManager userManager)
        : base(userManager)
    {
    }
}
