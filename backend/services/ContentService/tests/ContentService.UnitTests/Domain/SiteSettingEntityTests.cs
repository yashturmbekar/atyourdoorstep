using FluentAssertions;
using ContentService.Domain.Entities;

namespace ContentService.UnitTests.Domain;

public class SiteSettingEntityTests
{
    [Fact]
    public void SiteSetting_ShouldInitializeWithDefaults()
    {
        // Arrange & Act
        var setting = new SiteSetting();

        // Assert
        setting.Id.Should().NotBeEmpty();
        setting.IsPublic.Should().BeTrue();
        setting.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void SiteSetting_ShouldStoreKeyValuePair()
    {
        // Arrange
        var setting = new SiteSetting
        {
            Key = "contact.phone",
            Value = "+91-8237381312",
            SettingType = "string",
            Group = "contact"
        };

        // Assert
        setting.Key.Should().Be("contact.phone");
        setting.Value.Should().Be("+91-8237381312");
        setting.Group.Should().Be("contact");
    }

    [Theory]
    [InlineData("string")]
    [InlineData("number")]
    [InlineData("boolean")]
    [InlineData("json")]
    public void SiteSetting_SettingType_ShouldBeValid(string settingType)
    {
        // Arrange
        var setting = new SiteSetting { SettingType = settingType };

        // Assert
        setting.SettingType.Should().Be(settingType);
    }

    [Fact]
    public void SiteSetting_ShouldSupportPublicAndPrivateSettings()
    {
        // Arrange
        var publicSetting = new SiteSetting { Key = "site.name", IsPublic = true };
        var privateSetting = new SiteSetting { Key = "api.secret", IsPublic = false };

        // Assert
        publicSetting.IsPublic.Should().BeTrue();
        privateSetting.IsPublic.Should().BeFalse();
    }
}
