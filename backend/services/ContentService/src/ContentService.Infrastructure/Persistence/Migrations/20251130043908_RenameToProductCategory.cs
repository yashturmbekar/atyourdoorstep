using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ContentService.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RenameToProductCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop foreign key before renaming
            migrationBuilder.DropForeignKey(
                name: "f_k_products_categories_category_id",
                table: "products");

            migrationBuilder.DropForeignKey(
                name: "f_k_categories_categories_parent_id",
                table: "categories");

            // Rename table from categories to product_categories
            migrationBuilder.RenameTable(
                name: "categories",
                newName: "product_categories");

            // Drop image_url column from product_categories (was categories)
            migrationBuilder.DropColumn(
                name: "image_url",
                table: "product_categories");

            // Rename primary key constraint
            migrationBuilder.RenameIndex(
                name: "p_k_categories",
                table: "product_categories",
                newName: "p_k_product_categories");

            // Rename parent index
            migrationBuilder.RenameIndex(
                name: "i_x_categories_parent_id",
                table: "product_categories",
                newName: "i_x_product_categories_parent_id");

            // Rename slug unique index
            migrationBuilder.RenameIndex(
                name: "IX_categories_slug",
                table: "product_categories",
                newName: "IX_product_categories_slug");

            // Drop other image_url columns
            migrationBuilder.DropColumn(
                name: "customer_image_url",
                table: "testimonials");

            migrationBuilder.DropColumn(
                name: "image_url",
                table: "products");

            migrationBuilder.DropColumn(
                name: "url",
                table: "product_images");

            migrationBuilder.DropColumn(
                name: "image_url",
                table: "hero_slides");

            migrationBuilder.DropColumn(
                name: "image_url",
                table: "company_story_sections");

            // Rename category_id to product_category_id in products
            migrationBuilder.RenameColumn(
                name: "category_id",
                table: "products",
                newName: "product_category_id");

            migrationBuilder.RenameIndex(
                name: "i_x_products_category_id",
                table: "products",
                newName: "i_x_products_product_category_id");

            // Re-add foreign keys with new names
            migrationBuilder.AddForeignKey(
                name: "f_k_product_categories_product_categories_parent_id",
                table: "product_categories",
                column: "parent_id",
                principalTable: "product_categories",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "f_k_products_product_categories_product_category_id",
                table: "products",
                column: "product_category_id",
                principalTable: "product_categories",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "f_k_products_product_categories_product_category_id",
                table: "products");

            migrationBuilder.DropForeignKey(
                name: "f_k_product_categories_product_categories_parent_id",
                table: "product_categories");

            migrationBuilder.RenameColumn(
                name: "product_category_id",
                table: "products",
                newName: "category_id");

            migrationBuilder.RenameIndex(
                name: "i_x_products_product_category_id",
                table: "products",
                newName: "i_x_products_category_id");

            migrationBuilder.AddColumn<string>(
                name: "customer_image_url",
                table: "testimonials",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "image_url",
                table: "products",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "url",
                table: "product_images",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "image_url",
                table: "hero_slides",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "image_url",
                table: "company_story_sections",
                type: "text",
                nullable: true);

            // Rename table back
            migrationBuilder.RenameTable(
                name: "product_categories",
                newName: "categories");

            migrationBuilder.AddColumn<string>(
                name: "image_url",
                table: "categories",
                type: "text",
                nullable: true);

            // Rename indexes back
            migrationBuilder.RenameIndex(
                name: "p_k_product_categories",
                table: "categories",
                newName: "p_k_categories");

            migrationBuilder.RenameIndex(
                name: "i_x_product_categories_parent_id",
                table: "categories",
                newName: "i_x_categories_parent_id");

            migrationBuilder.RenameIndex(
                name: "IX_product_categories_slug",
                table: "categories",
                newName: "IX_categories_slug");

            migrationBuilder.AddForeignKey(
                name: "f_k_categories_categories_parent_id",
                table: "categories",
                column: "parent_id",
                principalTable: "categories",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "f_k_products_categories_category_id",
                table: "products",
                column: "category_id",
                principalTable: "categories",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
