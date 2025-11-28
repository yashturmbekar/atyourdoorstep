using FluentAssertions;
using ContentService.Domain.Entities;

namespace ContentService.UnitTests.Domain;

public class CategoryEntityTests
{
    [Fact]
    public void Category_ShouldInitializeWithDefaults()
    {
        // Arrange & Act
        var category = new Category();

        // Assert
        category.Id.Should().NotBeEmpty();
        category.IsActive.Should().BeTrue();
        category.DisplayOrder.Should().Be(0);
        category.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void Category_ShouldHaveValidSlug()
    {
        // Arrange
        var category = new Category
        {
            Name = "Fresh Fruits",
            Slug = "fresh-fruits",
            Description = "Fresh and organic fruits"
        };

        // Assert
        category.Slug.Should().NotContain(" ");
        category.Slug.Should().Be("fresh-fruits");
    }

    [Fact]
    public void Category_Products_ShouldBeInitializedAsEmptyList()
    {
        // Arrange & Act
        var category = new Category();

        // Assert
        category.Products.Should().NotBeNull();
        category.Products.Should().BeEmpty();
    }

    [Fact]
    public void Category_Children_ShouldBeInitializedAsEmptyList()
    {
        // Arrange & Act
        var category = new Category();

        // Assert
        category.Children.Should().NotBeNull();
        category.Children.Should().BeEmpty();
    }

    [Fact]
    public void Category_CanHaveParentCategory()
    {
        // Arrange
        var parentCategory = new Category
        {
            Name = "Fruits",
            Slug = "fruits"
        };

        var childCategory = new Category
        {
            Name = "Mangoes",
            Slug = "mangoes",
            ParentId = parentCategory.Id,
            Parent = parentCategory
        };

        // Assert
        childCategory.ParentId.Should().Be(parentCategory.Id);
        childCategory.Parent.Should().Be(parentCategory);
    }
}
