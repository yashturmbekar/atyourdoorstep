using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.Text;

namespace Shared.Infrastructure.Middlewares;

/// <summary>
/// Middleware for logging HTTP requests and responses
/// </summary>
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        var requestId = Guid.NewGuid().ToString();

        // Log request
        await LogRequestAsync(context, requestId);

        // Capture response
        var originalBodyStream = context.Response.Body;

        try
        {
            using var responseBody = new MemoryStream();
            context.Response.Body = responseBody;

            await _next(context);

            stopwatch.Stop();

            // Log response
            await LogResponseAsync(context, requestId, stopwatch.ElapsedMilliseconds);

            // Copy response body back to original stream
            await responseBody.CopyToAsync(originalBodyStream);
        }
        finally
        {
            context.Response.Body = originalBodyStream;
        }
    }

    private async Task LogRequestAsync(HttpContext context, string requestId)
    {
        try
        {
            var request = context.Request;
            
            // Don't log sensitive endpoints
            if (IsSensitiveEndpoint(request.Path))
            {
                _logger.LogInformation(
                    "[{RequestId}] Request: {Method} {Path} [SENSITIVE]",
                    requestId,
                    request.Method,
                    request.Path
                );
                return;
            }

            var logMessage = new StringBuilder();
            logMessage.AppendLine($"[{requestId}] Request Information:");
            logMessage.AppendLine($"Method: {request.Method}");
            logMessage.AppendLine($"Path: {request.Path}");
            logMessage.AppendLine($"QueryString: {request.QueryString}");
            logMessage.AppendLine($"Headers: {string.Join(", ", request.Headers.Where(h => !IsSensitiveHeader(h.Key)).Select(h => $"{h.Key}={h.Value}"))}");

            if (request.ContentLength > 0 && request.ContentLength < 10000)
            {
                request.EnableBuffering();
                var body = await new StreamReader(request.Body).ReadToEndAsync();
                request.Body.Position = 0;
                
                // Mask sensitive data in body
                logMessage.AppendLine($"Body: {MaskSensitiveData(body)}");
            }

            _logger.LogInformation(logMessage.ToString());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error logging request");
        }
    }

    private async Task LogResponseAsync(HttpContext context, string requestId, long elapsedMilliseconds)
    {
        try
        {
            var response = context.Response;

            var logMessage = new StringBuilder();
            logMessage.AppendLine($"[{requestId}] Response Information:");
            logMessage.AppendLine($"StatusCode: {response.StatusCode}");
            logMessage.AppendLine($"Duration: {elapsedMilliseconds}ms");

            if (response.Body.CanSeek)
            {
                response.Body.Seek(0, SeekOrigin.Begin);
                var body = await new StreamReader(response.Body).ReadToEndAsync();
                response.Body.Seek(0, SeekOrigin.Begin);

                if (body.Length < 10000)
                {
                    logMessage.AppendLine($"Body: {body}");
                }
            }

            _logger.LogInformation(logMessage.ToString());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error logging response");
        }
    }

    private static bool IsSensitiveEndpoint(PathString path)
    {
        var sensitiveEndpoints = new[] { "/auth/login", "/auth/register", "/auth/refresh" };
        return sensitiveEndpoints.Any(endpoint => path.StartsWithSegments(endpoint));
    }

    private static bool IsSensitiveHeader(string headerName)
    {
        var sensitiveHeaders = new[] { "authorization", "cookie", "x-api-key" };
        return sensitiveHeaders.Contains(headerName.ToLower());
    }

    private static string MaskSensitiveData(string data)
    {
        // Mask password, token, and other sensitive fields
        var sensitiveFields = new[] { "password", "token", "secret", "apiKey" };
        var maskedData = data;

        foreach (var field in sensitiveFields)
        {
            maskedData = System.Text.RegularExpressions.Regex.Replace(
                maskedData,
                $"\"{field}\"\\s*:\\s*\"[^\"]*\"",
                $"\"{field}\": \"***MASKED***\"",
                System.Text.RegularExpressions.RegexOptions.IgnoreCase
            );
        }

        return maskedData;
    }
}
