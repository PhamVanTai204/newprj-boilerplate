using newprj.Models.TokenAuth;
using newprj.Web.Controllers;
using Shouldly;
using System.Threading.Tasks;
using Xunit;

namespace newprj.Web.Tests.Controllers;

public class HomeController_Tests : newprjWebTestBase
{
    [Fact]
    public async Task Index_Test()
    {
        await AuthenticateAsync(null, new AuthenticateModel
        {
            UserNameOrEmailAddress = "admin",
            Password = "123qwe"
        });

        //Act
        var response = await GetResponseAsStringAsync(
            GetUrl<HomeController>(nameof(HomeController.Index))
        );

        //Assert
        response.ShouldNotBeNullOrEmpty();
    }
}