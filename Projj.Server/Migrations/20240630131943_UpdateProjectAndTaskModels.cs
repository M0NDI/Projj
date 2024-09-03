using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projj.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProjectAndTaskModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "ProjectTasks",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCompleted",
                table: "ProjectTasks");
        }
    }
}
