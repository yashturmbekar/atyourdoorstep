namespace ContentService.API.Models;

/// <summary>
/// Standard API response wrapper
/// </summary>
/// <typeparam name="T">Type of the data payload</typeparam>
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; }
    public List<string>? Errors { get; set; }

    public static ApiResponse<T> Ok(T data, string? message = null)
    {
        return new ApiResponse<T>
        {
            Success = true,
            Data = data,
            Message = message
        };
    }

    public static ApiResponse<T> Fail(string message, List<string>? errors = null)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = message,
            Errors = errors
        };
    }
}

/// <summary>
/// Paginated response wrapper
/// </summary>
/// <typeparam name="T">Type of items in the collection</typeparam>
public class PagedApiResponse<T>
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public IEnumerable<T>? Data { get; set; }
    public PaginationMeta? Meta { get; set; }

    public static PagedApiResponse<T> Ok(IEnumerable<T> data, int page, int pageSize, int total, string? message = null)
    {
        return new PagedApiResponse<T>
        {
            Success = true,
            Data = data,
            Message = message,
            Meta = new PaginationMeta
            {
                Page = page,
                PageSize = pageSize,
                Total = total,
                TotalPages = (int)Math.Ceiling((double)total / pageSize)
            }
        };
    }
}

public class PaginationMeta
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int Total { get; set; }
    public int TotalPages { get; set; }
}
