using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Shared.Application.DTOs;
using System.Net;
using System.Text.Json;

namespace Shared.Infrastructure.Middlewares;

/// <summary>
/// Global exception handling middleware
/// Catches all unhandled exceptions and returns standardized error responses
/// </summary>
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var response = ApiResponse<object>.ErrorResponse(
            "An error occurred while processing your request.",
            GetSafeErrorMessage(exception)
        );

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        var json = JsonSerializer.Serialize(response, options);
        await context.Response.WriteAsync(json);
    }

    private static string GetSafeErrorMessage(Exception exception)
    {
        // In production, never expose internal exception details
        // Return generic message or specific handled exceptions
        return exception switch
        {
            UnauthorizedAccessException => "Unauthorized access.",
            ArgumentException => "Invalid argument provided.",
            KeyNotFoundException => "The requested resource was not found.",
            InvalidOperationException => "Invalid operation.",
            _ => "An unexpected error occurred. Please try again later."
        };
    }
}
