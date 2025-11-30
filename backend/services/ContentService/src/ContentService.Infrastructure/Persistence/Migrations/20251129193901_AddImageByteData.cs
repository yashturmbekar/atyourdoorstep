using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ContentService.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddImageByteData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "customer_image_content_type",
                table: "testimonials",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "customer_image_data",
                table: "testimonials",
                type: "bytea",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "image_content_type",
                table: "products",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "image_data",
                table: "products",
                type: "bytea",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "image_content_type",
                table: "product_images",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "image_data",
                table: "product_images",
                type: "bytea",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "image_content_type",
                table: "hero_slides",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "image_data",
                table: "hero_slides",
                type: "bytea",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "image_content_type",
                table: "company_story_sections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "image_data",
                table: "company_story_sections",
                type: "bytea",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "image_content_type",
                table: "categories",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "image_data",
                table: "categories",
                type: "bytea",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "customer_image_content_type",
                table: "testimonials");

            migrationBuilder.DropColumn(
                name: "customer_image_data",
                table: "testimonials");

            migrationBuilder.DropColumn(
                name: "image_content_type",
                table: "products");

            migrationBuilder.DropColumn(
                name: "image_data",
                table: "products");

            migrationBuilder.DropColumn(
                name: "image_content_type",
                table: "product_images");

            migrationBuilder.DropColumn(
                name: "image_data",
                table: "product_images");

            migrationBuilder.DropColumn(
                name: "image_content_type",
                table: "hero_slides");

            migrationBuilder.DropColumn(
                name: "image_data",
                table: "hero_slides");

            migrationBuilder.DropColumn(
                name: "image_content_type",
                table: "company_story_sections");

            migrationBuilder.DropColumn(
                name: "image_data",
                table: "company_story_sections");

            migrationBuilder.DropColumn(
                name: "image_content_type",
                table: "categories");

            migrationBuilder.DropColumn(
                name: "image_data",
                table: "categories");
        }
    }
}
