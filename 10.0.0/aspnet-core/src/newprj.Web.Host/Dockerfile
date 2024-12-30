FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src
COPY ["src/newprj.Web.Host/newprj.Web.Host.csproj", "src/newprj.Web.Host/"]
COPY ["src/newprj.Web.Core/newprj.Web.Core.csproj", "src/newprj.Web.Core/"]
COPY ["src/newprj.Application/newprj.Application.csproj", "src/newprj.Application/"]
COPY ["src/newprj.Core/newprj.Core.csproj", "src/newprj.Core/"]
COPY ["src/newprj.EntityFrameworkCore/newprj.EntityFrameworkCore.csproj", "src/newprj.EntityFrameworkCore/"]
WORKDIR "/src/src/newprj.Web.Host"
RUN dotnet restore 

WORKDIR /src
COPY ["src/newprj.Web.Host", "src/newprj.Web.Host"]
COPY ["src/newprj.Web.Core", "src/newprj.Web.Core"]
COPY ["src/newprj.Application", "src/newprj.Application"]
COPY ["src/newprj.Core", "src/newprj.Core"]
COPY ["src/newprj.EntityFrameworkCore", "src/newprj.EntityFrameworkCore"]
WORKDIR "/src/src/newprj.Web.Host"
RUN dotnet publish -c Release -o /publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
EXPOSE 80
WORKDIR /app
COPY --from=build /publish .
ENTRYPOINT ["dotnet", "newprj.Web.Host.dll"]
