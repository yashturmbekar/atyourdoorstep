using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Net.Http.Json;

namespace ContentService.IntegrationTests.Controllers;

public class TestimonialsControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public TestimonialsControllerTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetTestimonials_ShouldReturnOk()
    {
        // Act
        var response = await _client.GetAsync("/api/testimonials");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetFeaturedTestimonials_ShouldReturnOk()
    {
        // Act
        var response = await _client.GetAsync("/api/testimonials/featured");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetApprovedTestimonials_ShouldReturnOk()
    {
        // Act
        var response = await _client.GetAsync("/api/testimonials/approved");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
