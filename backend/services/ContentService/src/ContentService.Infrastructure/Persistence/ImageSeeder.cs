using Microsoft.Extensions.Logging;

namespace ContentService.Infrastructure.Persistence;

/// <summary>
/// Helper class to load seed images from filesystem
/// Images should be placed in the SeedImages folder during deployment
/// </summary>
public static class ImageSeeder
{
    private static readonly Dictionary<string, (byte[] Data, string ContentType)> _imageCache = new();

    /// <summary>
    /// Image mappings for seeding - maps logical names to actual filenames
    /// </summary>
    public static readonly Dictionary<string, string> CategoryImages = new()
    {
        { "alphonso", "mangoes-carousel.png" },
        { "jaggery", "jaggery-carousel.png" },
        { "oil", "cold-pressed-oil-carousel.png" }
    };

    public static readonly Dictionary<string, string> ProductImages = new()
    {
        { "premium-alphonso-mangoes", "mangoes-carousel.png" },
        { "sun-premium-alphonso-mangoes", "mangoes-carousel-1.png" },
        { "organic-jaggery-block", "jaggery-carousel.png" },
        { "organic-jaggery-powder", "jaggery-powder-carousel.png" },
        { "cold-pressed-sunflower-oil", "cold-pressed-oil-carousel.png" },
        { "cold-pressed-groundnut-oil", "cold-pressed-oil-carousel.png" },
        { "cold-pressed-sesame-oil", "cold-pressed-oil-carousel-1.png" },
        { "cold-pressed-almond-oil", "cold-pressed-oil-carousel-1.png" },
        { "cold-pressed-mustard-oil", "cold-pressed-oil-carousel.png" },
        { "cold-pressed-coconut-oil", "cold-pressed-oil-carousel-1.png" }
    };

    public static readonly Dictionary<string, string> HeroSlideImages = new()
    {
        { "alphonso", "mangoes-carousel.png" },
        { "oil", "cold-pressed-oil-carousel.png" },
        { "jaggery", "jaggery-carousel.png" }
    };

    public static readonly Dictionary<string, string> CompanyStoryImages = new()
    {
        { "our_story", "ourstory.png" },
        { "our_spaces", "Ourspace.png" },
        { "our_products", "Ourproduct.png" }
    };

    /// <summary>
    /// Get image data from filesystem or cache
    /// </summary>
    /// <param name="imagePath">Full path to the image file</param>
    /// <returns>Tuple of (byte[] data, string contentType) or null if not found</returns>
    public static (byte[]? Data, string? ContentType) GetImage(string imagePath)
    {
        if (string.IsNullOrEmpty(imagePath))
            return (null, null);

        // Check cache first
        if (_imageCache.TryGetValue(imagePath, out var cached))
            return (cached.Data, cached.ContentType);

        // Try to load from filesystem
        if (!File.Exists(imagePath))
            return (null, null);

        try
        {
            var data = File.ReadAllBytes(imagePath);
            var contentType = GetContentType(imagePath);
            
            // Cache for future use
            _imageCache[imagePath] = (data, contentType);
            
            return (data, contentType);
        }
        catch
        {
            return (null, null);
        }
    }

    /// <summary>
    /// Get image data by logical name and image mapping
    /// </summary>
    public static (byte[]? Data, string? ContentType) GetImageByName(
        string logicalName, 
        Dictionary<string, string> imageMapping,
        string seedImagesPath)
    {
        if (!imageMapping.TryGetValue(logicalName, out var filename))
            return (null, null);

        var fullPath = Path.Combine(seedImagesPath, filename);
        return GetImage(fullPath);
    }

    /// <summary>
    /// Get the MIME content type based on file extension
    /// </summary>
    private static string GetContentType(string filePath)
    {
        var extension = Path.GetExtension(filePath).ToLowerInvariant();
        return extension switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            ".svg" => "image/svg+xml",
            ".bmp" => "image/bmp",
            _ => "application/octet-stream"
        };
    }

    /// <summary>
    /// Clear the image cache
    /// </summary>
    public static void ClearCache()
    {
        _imageCache.Clear();
    }

    /// <summary>
    /// Get the default seed images path
    /// Looks in multiple locations for flexibility
    /// </summary>
    public static string? GetSeedImagesPath()
    {
        // Try various paths where seed images might be located
        var possiblePaths = new[]
        {
            // Relative to current directory
            Path.Combine(Directory.GetCurrentDirectory(), "SeedImages"),
            Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "SeedImages"),
            
            // Relative to assembly location
            Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "SeedImages"),
            Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "wwwroot", "SeedImages"),
            
            // Development paths (relative to solution)
            Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..", "..", "frontend", "public", "images"),
            Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "..", "frontend", "public", "images"),
            
            // Docker/production path
            "/app/SeedImages"
        };

        foreach (var path in possiblePaths)
        {
            var normalizedPath = Path.GetFullPath(path);
            if (Directory.Exists(normalizedPath))
            {
                return normalizedPath;
            }
        }

        return null;
    }
}
