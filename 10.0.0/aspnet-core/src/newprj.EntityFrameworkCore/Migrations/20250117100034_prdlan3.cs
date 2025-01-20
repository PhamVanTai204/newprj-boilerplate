using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace newprj.Migrations
{
    /// <inheritdoc />
    public partial class prdlan3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "masp",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "masp",
                table: "Products");
        }
    }
}
