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
        productsPermission.CreateChildPermission("Pages.Products.Update", L("UpdateProduct"));
        productsPermission.CreateChildPermission("Pages.Products.Delete", L("DeleteProduct"));

        var cartPermission = context.CreatePermission("Pages.Cart", L("Cart"));
        cartPermission.CreateChildPermission("Pages.Cart.Create", L("CreateCart"));
        cartPermission.CreateChildPermission("Pages.Cart.Edit", L("EditCart"));
        cartPermission.CreateChildPermission("Pages.Cart.Delete", L("DeleteCart"));

        var cartItemPermission = context.CreatePermission("Pages.CartItem", L("CartItem"));
        cartPermission.CreateChildPermission("Pages.Cart.CreateItem", L("CreateCartItem"));
        cartPermission.CreateChildPermission("Pages.Cart.EditItem", L("EditCartItem"));
        cartPermission.CreateChildPermission("Pages.Cart.DeleteItem", L("DeleteCartItem")); 

        var invoicesPermission = context.CreatePermission("Pages.Invoices", L("Invoices"));
        invoicesPermission.CreateChildPermission("Pages.Invoices.Create", L("CreateInvoice"));
        invoicesPermission.CreateChildPermission("Pages.Invoices.Update", L("UpdateInvoice"));
        invoicesPermission.CreateChildPermission("Pages.Invoices.Admin", L("AdminInvoice"));


    }

    private static ILocalizableString L(string name)
    {
        return new LocalizableString(name, newprjConsts.LocalizationSourceName);
    }
}
