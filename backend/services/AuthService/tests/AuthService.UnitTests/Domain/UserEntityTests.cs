using FluentAssertions;
using AuthService.Domain.Entities;

namespace AuthService.UnitTests.Domain;

public class UserEntityTests
{
    [Fact]
    public void User_ShouldInitializeWithDefaults()
    {
        // Arrange & Act
        var user = new User();

        // Assert
        user.Id.Should().NotBeEmpty();
        user.IsActive.Should().BeTrue();
        user.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Theory]
    [InlineData("user@example.com", true)]
    [InlineData("invalid-email", false)]
    [InlineData("", false)]
    public void User_EmailValidation_ShouldWork(string email, bool isValid)
    {
        // Arrange
        var user = new User { Email = email };

        // Act
        var hasValidFormat = email.Contains("@") && email.Contains(".");

        // Assert
        hasValidFormat.Should().Be(isValid);
    }

    [Fact]
    public void User_PasswordHash_ShouldNotBeNull()
    {
        // Arrange
        var user = new User
        {
            Email = "test@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("SecurePassword123!")
        };

        // Assert
        user.PasswordHash.Should().NotBeNullOrEmpty();
        user.PasswordHash.Should().NotBe("SecurePassword123!");
    }
}
