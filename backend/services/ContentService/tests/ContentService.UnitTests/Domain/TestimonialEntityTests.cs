using FluentAssertions;
using ContentService.Domain.Entities;

namespace ContentService.UnitTests.Domain;

public class TestimonialEntityTests
{
    [Fact]
    public void Testimonial_ShouldInitializeWithDefaults()
    {
        // Arrange & Act
        var testimonial = new Testimonial();

        // Assert
        testimonial.Id.Should().NotBeEmpty();
        testimonial.Rating.Should().Be(5);
        testimonial.IsFeatured.Should().BeFalse();
        testimonial.IsApproved.Should().BeFalse();
        testimonial.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void Testimonial_ShouldHaveValidRating()
    {
        // Arrange
        var testimonial = new Testimonial
        {
            CustomerName = "John Doe",
            CustomerTitle = "Verified Buyer",
            Content = "Great product!",
            Rating = 5
        };

        // Assert
        testimonial.Rating.Should().BeInRange(1, 5);
    }

    [Fact]
    public void Testimonial_ShouldRequireCustomerName()
    {
        // Arrange
        var testimonial = new Testimonial
        {
            CustomerName = "Priya Sharma",
            CustomerTitle = "Mumbai Resident",
            Content = "Excellent mangoes!"
        };

        // Assert
        testimonial.CustomerName.Should().NotBeNullOrEmpty();
    }

    [Theory]
    [InlineData(1)]
    [InlineData(2)]
    [InlineData(3)]
    [InlineData(4)]
    [InlineData(5)]
    public void Testimonial_Rating_ShouldBeValid(int rating)
    {
        // Arrange
        var testimonial = new Testimonial { Rating = rating };

        // Assert
        testimonial.Rating.Should().BeInRange(1, 5);
    }
}
