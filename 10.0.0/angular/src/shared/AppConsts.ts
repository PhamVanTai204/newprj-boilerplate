export class AppConsts {

    static readonly tenancyNamePlaceHolderInUrl = '{TENANCY_NAME}';

    static remoteServiceBaseUrl: string;
    static appBaseUrl: string;
    static appBaseHref: string; // returns angular's base-href parameter value if used during the publish

    static localeMappings: any = [];

    static readonly userManagement = {
        defaultAdminUserName: 'admin'
    };

    static readonly localization = {
        defaultLocalizationSourceName: 'newprj'
    };

    static readonly authorization = {
        encryptedAuthTokenName: 'enc_auth_token'
    };



    static readonly permissions = {
        //  Products
        productCreate: 'Pages.Products.Create',
        productUpdate: 'Pages.Products.Update',

        // CartItem 
        cartItemCreate: 'Pages.Cart.CreateItem',


        //invoice
        invoiceAdin: 'Pages.Invoices.Admin',
        invoiceUpdate: 'Pages.Invoices.Update'
    }
}
