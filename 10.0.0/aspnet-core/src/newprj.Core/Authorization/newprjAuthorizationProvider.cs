using Abp.Authorization;
using Abp.Localization;
using Abp.MultiTenancy;

namespace newprj.Authorization;

public class newprjAuthorizationProvider : AuthorizationProvider
{
    public override void SetPermissions(IPermissionDefinitionContext context)
    {
        context.CreatePermission(PermissionNames.Pages_Users, L("Users"));
        context.CreatePermission(PermissionNames.Pages_Users_Activation, L("UsersActivation"));
        context.CreatePermission(PermissionNames.Pages_Roles, L("Roles"));
        context.CreatePermission(PermissionNames.Pages_Tenants, L("Tenants"), multiTenancySides: MultiTenancySides.Host);
       
        var productsPermission = context.CreatePermission("Pages.Products", L("Products"));
        productsPermission.CreateChildPermission("Pages.Products.Create", L("CreateProduct"));
        productsPermission.CreateChildPermission("Pages.Products.Edit", L("EditProduct"));
        productsPermission.CreateChildPermission("Pages.Products.Delete", L("DeleteProduct"));

    }

    private static ILocalizableString L(string name)
    {
        return new LocalizableString(name, newprjConsts.LocalizationSourceName);
    }
}
