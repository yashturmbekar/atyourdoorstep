using FluentAssertions;
using ContentService.Domain.Entities;

namespace ContentService.UnitTests.Domain;

public class ProductEntityTests
{
    [Fact]
    public void Product_ShouldInitializeWithDefaults()
    {
        // Arrange & Act
        var product = new Product();

        // Assert
        product.Id.Should().NotBeEmpty();
        product.IsAvailable.Should().BeTrue();
        product.IsFeatured.Should().BeFalse();
        product.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void Product_ShouldHaveValidSlug()
    {
        // Arrange
        var product = new Product
        {
            Name = "Alphonso Mangoes",
            Slug = "alphonso-mangoes",
            FullDescription = "Premium quality Alphonso mangoes from Ratnagiri"
        };

        // Assert
        product.Slug.Should().NotContain(" ");
        product.Slug.Should().Be("alphonso-mangoes");
    }

    [Fact]
    public void Product_Variants_ShouldBeInitializedAsEmptyList()
    {
        // Arrange & Act
        var product = new Product();

        // Assert
        product.Variants.Should().NotBeNull();
        product.Variants.Should().BeEmpty();
    }

    [Fact]
    public void Product_Features_ShouldBeInitializedAsEmptyList()
    {
        // Arrange & Act
        var product = new Product();

        // Assert
        product.Features.Should().NotBeNull();
        product.Features.Should().BeEmpty();
    }

    [Fact]
    public void Product_Images_ShouldBeInitializedAsEmptyList()
    {
        // Arrange & Act
        var product = new Product();

        // Assert
        product.Images.Should().NotBeNull();
        product.Images.Should().BeEmpty();
    }
}
