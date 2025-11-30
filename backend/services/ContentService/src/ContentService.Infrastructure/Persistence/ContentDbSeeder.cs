using Microsoft.EntityFrameworkCore;
using ContentService.Domain.Entities;

namespace ContentService.Infrastructure.Persistence;

/// <summary>
/// Static class containing all seed data for initial database population
/// This converts all hardcoded frontend data into database records
/// </summary>
public static class ContentDbSeeder
{
    private static string? _seedImagesPath;

    public static async Task SeedAsync(ContentDbContext context)
    {
        // Ensure database is created
        await context.Database.MigrateAsync();

        // Try to find seed images path
        _seedImagesPath = ImageSeeder.GetSeedImagesPath();
        if (_seedImagesPath != null)
        {
            Console.WriteLine($"[Seeder] Found seed images at: {_seedImagesPath}");
        }
        else
        {
            Console.WriteLine("[Seeder] Warning: Seed images path not found. Seeding without images.");
        }

        // Seed in order of dependencies
        await SeedCategoriesAsync(context);
        await SeedProductsAsync(context);
        await SeedTestimonialsAsync(context);
        await SeedSiteSettingsAsync(context);
        await SeedHeroSlidesAsync(context);
        await SeedStatisticsAsync(context);
        await SeedUspItemsAsync(context);
        await SeedCompanyStorySectionsAsync(context);
        await SeedInquiryTypesAsync(context);
        await SeedDeliverySettingsAsync(context);

        await context.SaveChangesAsync();
        
        // Clear image cache after seeding
        ImageSeeder.ClearCache();
    }

    /// <summary>
    /// Helper to get image data for seeding
    /// </summary>
    private static (byte[]? Data, string? ContentType) GetSeedImage(string logicalName, Dictionary<string, string> imageMapping)
    {
        if (_seedImagesPath == null)
            return (null, null);

        return ImageSeeder.GetImageByName(logicalName, imageMapping, _seedImagesPath);
    }

    private static async Task SeedCategoriesAsync(ContentDbContext context)
    {
        if (await context.ProductCategories.AnyAsync()) return;

        // Get images for categories
        var alphonsoImage = GetSeedImage("alphonso", ImageSeeder.CategoryImages);
        var jaggeryImage = GetSeedImage("jaggery", ImageSeeder.CategoryImages);
        var oilImage = GetSeedImage("oil", ImageSeeder.CategoryImages);

        var categories = new List<ProductCategory>
        {
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                Name = "Alphonso Mangoes",
                Slug = "alphonso",
                Description = "Fresh, premium quality Alphonso mangoes - the king of mangoes. Sweet, juicy, and aromatic.",
                Icon = "🥭",
                ImageData = alphonsoImage.Data,
                ImageContentType = alphonsoImage.ContentType,
                DisplayOrder = 1,
                IsActive = true
            },
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                Name = "Jaggery Products",
                Slug = "jaggery",
                Description = "Pure, organic jaggery products made from sugarcane using traditional methods.",
                Icon = "🍯",
                ImageData = jaggeryImage.Data,
                ImageContentType = jaggeryImage.ContentType,
                DisplayOrder = 2,
                IsActive = true
            },
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                Name = "Cold Pressed Oils",
                Slug = "oil",
                Description = "Pure, unrefined oils extracted using traditional cold-pressing methods. No chemicals, retains natural nutrients.",
                Icon = "🛢️",
                ImageData = oilImage.Data,
                ImageContentType = oilImage.ContentType,
                DisplayOrder = 3,
                IsActive = true
            }
        };

        await context.ProductCategories.AddRangeAsync(categories);
    }

    private static async Task SeedProductsAsync(ContentDbContext context)
    {
        if (await context.Products.AnyAsync()) return;

        var alphonsoCategoryId = Guid.Parse("00000000-0000-0000-0000-000000000001");
        var jaggeryCategoryId = Guid.Parse("00000000-0000-0000-0000-000000000002");
        var oilCategoryId = Guid.Parse("00000000-0000-0000-0000-000000000003");

        // Get images for products
        var mangoImage1 = GetSeedImage("premium-alphonso-mangoes", ImageSeeder.ProductImages);
        var mangoImage2 = GetSeedImage("sun-premium-alphonso-mangoes", ImageSeeder.ProductImages);
        var jaggeryBlockImage = GetSeedImage("organic-jaggery-block", ImageSeeder.ProductImages);
        var jaggeryPowderImage = GetSeedImage("organic-jaggery-powder", ImageSeeder.ProductImages);
        var sunflowerOilImage = GetSeedImage("cold-pressed-sunflower-oil", ImageSeeder.ProductImages);
        var groundnutOilImage = GetSeedImage("cold-pressed-groundnut-oil", ImageSeeder.ProductImages);
        var sesameOilImage = GetSeedImage("cold-pressed-sesame-oil", ImageSeeder.ProductImages);
        var almondOilImage = GetSeedImage("cold-pressed-almond-oil", ImageSeeder.ProductImages);
        var mustardOilImage = GetSeedImage("cold-pressed-mustard-oil", ImageSeeder.ProductImages);
        var coconutOilImage = GetSeedImage("cold-pressed-coconut-oil", ImageSeeder.ProductImages);

        var products = new List<Product>
        {
            // Alphonso Mangoes
            new()
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000001"),
                Name = "Premium Alphonso Mangoes",
                Slug = "premium-alphonso-mangoes",
                FullDescription = "Fresh, premium quality Alphonso mangoes - the king of mangoes. Sweet, juicy, and aromatic.",
                ShortDescription = "The king of mangoes with exceptional sweetness",
                ProductCategoryId = alphonsoCategoryId,
                ImageData = mangoImage1.Data,
                ImageContentType = mangoImage1.ContentType,
                IsAvailable = true,
                IsFeatured = true,
                DisplayOrder = 1,
                SeasonStart = "March",
                SeasonEnd = "May",
                Variants = new List<ProductVariant>
                {
                    new() { Id = Guid.NewGuid(), Size = "2 dozen", Unit = "dozen", Price = 1600, StockQuantity = 100, IsInStock = true, DisplayOrder = 1 }
                },
                Features = new List<ProductFeature>
                {
                    new() { Feature = "GI Tagged Authentic", DisplayOrder = 1 },
                    new() { Feature = "Hand-picked Premium", DisplayOrder = 2 },
                    new() { Feature = "Perfectly Ripened", DisplayOrder = 3 },
                    new() { Feature = "Natural Sweetness", DisplayOrder = 4 }
                }
            },
            new()
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000002"),
                Name = "Sun Product - Premium Alphonso Mangoes",
                Slug = "sun-premium-alphonso-mangoes",
                FullDescription = "Premium sun-ripened Alphonso mangoes with exceptional sweetness and flavor. Perfect for gifting and special occasions.",
                ShortDescription = "Premium sun-ripened mangoes for special occasions",
                ProductCategoryId = alphonsoCategoryId,
                ImageData = mangoImage2.Data,
                ImageContentType = mangoImage2.ContentType,
                IsAvailable = true,
                IsFeatured = false,
                DisplayOrder = 2,
                SeasonStart = "March",
                SeasonEnd = "May",
                Variants = new List<ProductVariant>
                {
                    new() { Id = Guid.NewGuid(), Size = "5 dozen", Unit = "dozen", Price = 4000, StockQuantity = 50, IsInStock = true, DisplayOrder = 1 }
                },
                Features = new List<ProductFeature>
                {
                    new() { Feature = "Sun-Ripened Naturally", DisplayOrder = 1 },
                    new() { Feature = "Premium Selection", DisplayOrder = 2 },
                    new() { Feature = "Gift Quality", DisplayOrder = 3 }
                }
            },
            // Jaggery Products
            new()
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000003"),
                Name = "Organic Jaggery (Block)",
                Slug = "organic-jaggery-block",
                FullDescription = "Traditional pure organic jaggery blocks (kolhapuri gul/gud) made from sugarcane. Natural sweetener with rich minerals.",
                ShortDescription = "Traditional kolhapuri jaggery blocks",
                ProductCategoryId = jaggeryCategoryId,
                ImageData = jaggeryBlockImage.Data,
                ImageContentType = jaggeryBlockImage.ContentType,
                IsAvailable = true,
                IsFeatured = true,
                DisplayOrder = 1,
                Variants = new List<ProductVariant>
                {
                    new() { Id = Guid.NewGuid(), Size = "1 kg", Unit = "kg", Price = 80, StockQuantity = 500, IsInStock = true, DisplayOrder = 1 }
                },
                Features = new List<ProductFeature>
                {
                    new() { Feature = "100% Organic", DisplayOrder = 1 },
                    new() { Feature = "Traditional Processing", DisplayOrder = 2 },
                    new() { Feature = "Rich in Minerals", DisplayOrder = 3 },
                    new() { Feature = "No Artificial Additives", DisplayOrder = 4 }
                }
            },
            new()
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000004"),
                Name = "Organic Jaggery (Powder)",
                Slug = "organic-jaggery-powder",
                FullDescription = "Fine organic jaggery powder for easy cooking and baking. Perfect for tea, desserts and daily use.",
                ShortDescription = "Fine jaggery powder for cooking and baking",
                ProductCategoryId = jaggeryCategoryId,
                ImageData = jaggeryPowderImage.Data,
                ImageContentType = jaggeryPowderImage.ContentType,
                IsAvailable = true,
                IsFeatured = false,
                DisplayOrder = 2,
                Variants = new List<ProductVariant>
                {
                    new() { Id = Guid.NewGuid(), Size = "500 g", Unit = "g", Price = 150, StockQuantity = 300, IsInStock = true, DisplayOrder = 1 },
                    new() { Id = Guid.NewGuid(), Size = "1 kg", Unit = "kg", Price = 280, StockQuantity = 200, IsInStock = true, DisplayOrder = 2 }
                },
                Features = new List<ProductFeature>
                {
                    new() { Feature = "Easy to Use", DisplayOrder = 1 },
                    new() { Feature = "Perfect for Tea", DisplayOrder = 2 },
                    new() { Feature = "Baking Friendly", DisplayOrder = 3 }
                }
            },
            // Cold Pressed Oils
            new()
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000005"),
                Name = "Cold Pressed Sunflower Oil",
                Slug = "cold-pressed-sunflower-oil",
                FullDescription = "Pure cold-pressed sunflower oil. Rich in Vitamin E and perfect for cooking.",
                ShortDescription = "Rich in Vitamin E, perfect for daily cooking",
                ProductCategoryId = oilCategoryId,
                ImageData = sunflowerOilImage.Data,
                ImageContentType = sunflowerOilImage.ContentType,
                IsAvailable = true,
                IsFeatured = true,
                DisplayOrder = 1,
                Variants = new List<ProductVariant>
                {
                    new() { Id = Guid.NewGuid(), Size = "1 L", Unit = "L", Price = 320, StockQuantity = 150, IsInStock = true, DisplayOrder = 1 },
                    new() { Id = Guid.NewGuid(), Size = "2 L", Unit = "L", Price = 620, StockQuantity = 100, IsInStock = true, DisplayOrder = 2 },
                    new() { Id = Guid.NewGuid(), Size = "5 L", Unit = "L", Price = 1500, StockQuantity = 50, IsInStock = true, DisplayOrder = 3 }
                },
                Features = new List<ProductFeature>
                {
                    new() { Feature = "Traditional Cold-Pressed", DisplayOrder = 1 },
                    new() { Feature = "No Chemical Processing", DisplayOrder = 2 },
                    new() { Feature = "Retains Natural Nutrients", DisplayOrder = 3 },
                    new() { Feature = "Rich in Vitamin E", DisplayOrder = 4 }
                }
            },
            new()
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000006"),
                Name = "Cold Pressed Groundnut Oil",
                Slug = "cold-pressed-groundnut-oil",
                FullDescription = "Pure cold-pressed groundnut (peanut) oil. Traditional method of extraction preserves nutrients.",
                ShortDescription = "Traditional groundnut oil with rich flavor",
                ProductCategoryId = oilCategoryId,
                ImageData = groundnutOilImage.Data,
                ImageContentType = groundnutOilImage.ContentType,
                IsAvailable = true,
                IsFeatured = false,
                DisplayOrder = 2,
                Variants = new List<ProductVariant>
                {
                    new() { Id = Guid.NewGuid(), Size = "1 L", Unit = "L", Price = 380, StockQuantity = 150, IsInStock = true, DisplayOrder = 1 },
                    new() { Id = Guid.NewGuid(), Size = "2 L", Unit = "L", Price = 740, StockQuantity = 100, IsInStock = true, DisplayOrder = 2 },
                    new() { Id = Guid.NewGuid(), Size = "5 L", Unit = "L", Price = 1800, StockQuantity = 50, IsInStock = true, DisplayOrder = 3 }
                },
                Features = new List<ProductFeature>
                {
                    new() { Feature = "Pure Groundnut", DisplayOrder = 1 },
                    new() { Feature = "Traditional Method", DisplayOrder = 2 },
                    new() { Feature = "Rich Aroma", DisplayOrder = 3 }
                }
            },
            new()
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000007"),
                Name = "Cold Pressed Sesame Oil",
                Slug = "cold-pressed-sesame-oil",
                FullDescription = "Pure cold-pressed sesame oil. Perfect for cooking and ayurvedic treatments.",
                ShortDescription = "Pure sesame oil for cooking and wellness",
                ProductCategoryId = oilCategoryId,
                ImageData = sesameOilImage.Data,
                ImageContentType = sesameOilImage.ContentType,
                IsAvailable = true,
                IsFeatured = false,
                DisplayOrder = 3,
                Variants = new List<ProductVariant>
                {
                    new() { Id = Guid.NewGuid(), Size = "200 ml", Unit = "ml", Price = 120, StockQuantity = 200, IsInStock = true, DisplayOrder = 1 },
                    new() { Id = Guid.NewGuid(), Size = "500 ml", Unit = "ml", Price = 250, StockQuantity = 150, IsInStock = true, DisplayOrder = 2 },
                    new() { Id = Guid.NewGuid(), Size = "1 L", Unit = "L", Price = 480, StockQuantity = 100, IsInStock = true, DisplayOrder = 3 }
                },
                Features = new List<ProductFeature>
                {
                    new() { Feature = "Ayurvedic Quality", DisplayOrder = 1 },
                    new() { Feature = "Multi-purpose", DisplayOrder = 2 },
                    new() { Feature = "Heart Healthy", DisplayOrder = 3 }
                }
            },
            new()
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000008"),
                Name = "Cold Pressed Almond Oil",
                Slug = "cold-pressed-almond-oil",
                FullDescription = "Premium cold-pressed almond oil. Perfect for baby care and skin care.",
                ShortDescription = "Premium almond oil for baby and skin care",
                ProductCategoryId = oilCategoryId,
                ImageData = almondOilImage.Data,
                ImageContentType = almondOilImage.ContentType,
                IsAvailable = true,
                IsFeatured = false,
                DisplayOrder = 4,
                Variants = new List<ProductVariant>
                {
                    new() { Id = Guid.NewGuid(), Size = "50 ml", Unit = "ml", Price = 300, StockQuantity = 200, IsInStock = true, DisplayOrder = 1 },
                    new() { Id = Guid.NewGuid(), Size = "100 ml", Unit = "ml", Price = 600, StockQuantity = 150, IsInStock = true, DisplayOrder = 2 },
                    new() { Id = Guid.NewGuid(), Size = "200 ml", Unit = "ml", Price = 600, StockQuantity = 100, IsInStock = true, DisplayOrder = 3 },
                    new() { Id = Guid.NewGuid(), Size = "500 ml", Unit = "ml", Price = 800, StockQuantity = 50, IsInStock = true, DisplayOrder = 4 }
                },
                Features = new List<ProductFeature>
                {
                    new() { Feature = "Baby Safe", DisplayOrder = 1 },
                    new() { Feature = "Skin Nourishing", DisplayOrder = 2 },
                    new() { Feature = "Premium Quality", DisplayOrder = 3 }
                }
            },
            new()
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000009"),
                Name = "Cold Pressed Mustard Oil",
                Slug = "cold-pressed-mustard-oil",
                FullDescription = "Pure cold-pressed mustard oil. Traditional cooking oil with strong flavor, perfect for Indian cuisine.",
                ShortDescription = "Traditional mustard oil for authentic Indian cooking",
                ProductCategoryId = oilCategoryId,
                ImageData = mustardOilImage.Data,
                ImageContentType = mustardOilImage.ContentType,
                IsAvailable = true,
                IsFeatured = false,
                DisplayOrder = 5,
                Variants = new List<ProductVariant>
                {
                    new() { Id = Guid.NewGuid(), Size = "500 ml", Unit = "ml", Price = 180, StockQuantity = 200, IsInStock = true, DisplayOrder = 1 },
                    new() { Id = Guid.NewGuid(), Size = "1 L", Unit = "L", Price = 340, StockQuantity = 150, IsInStock = true, DisplayOrder = 2 },
                    new() { Id = Guid.NewGuid(), Size = "2 L", Unit = "L", Price = 660, StockQuantity = 100, IsInStock = true, DisplayOrder = 3 },
                    new() { Id = Guid.NewGuid(), Size = "5 L", Unit = "L", Price = 1600, StockQuantity = 50, IsInStock = true, DisplayOrder = 4 }
                },
                Features = new List<ProductFeature>
                {
                    new() { Feature = "Authentic Flavor", DisplayOrder = 1 },
                    new() { Feature = "Traditional Extraction", DisplayOrder = 2 },
                    new() { Feature = "Perfect for Pickles", DisplayOrder = 3 }
                }
            },
            new()
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000010"),
                Name = "Cold Pressed Coconut Oil",
                Slug = "cold-pressed-coconut-oil",
                FullDescription = "Premium cold-pressed virgin coconut oil. Perfect for cooking, hair care, and skin care.",
                ShortDescription = "Multi-purpose virgin coconut oil",
                ProductCategoryId = oilCategoryId,
                ImageData = coconutOilImage.Data,
                ImageContentType = coconutOilImage.ContentType,
                IsAvailable = true,
                IsFeatured = false,
                DisplayOrder = 6,
                Variants = new List<ProductVariant>
                {
                    new() { Id = Guid.NewGuid(), Size = "200 ml", Unit = "ml", Price = 220, StockQuantity = 200, IsInStock = true, DisplayOrder = 1 },
                    new() { Id = Guid.NewGuid(), Size = "500 ml", Unit = "ml", Price = 480, StockQuantity = 150, IsInStock = true, DisplayOrder = 2 },
                    new() { Id = Guid.NewGuid(), Size = "1 L", Unit = "L", Price = 920, StockQuantity = 100, IsInStock = true, DisplayOrder = 3 },
                    new() { Id = Guid.NewGuid(), Size = "2 L", Unit = "L", Price = 1800, StockQuantity = 50, IsInStock = true, DisplayOrder = 4 }
                },
                Features = new List<ProductFeature>
                {
                    new() { Feature = "Virgin Quality", DisplayOrder = 1 },
                    new() { Feature = "Multi-purpose", DisplayOrder = 2 },
                    new() { Feature = "Hair & Skin Care", DisplayOrder = 3 },
                    new() { Feature = "Cooking Friendly", DisplayOrder = 4 }
                }
            }
        };

        await context.Products.AddRangeAsync(products);
    }

    private static async Task SeedTestimonialsAsync(ContentDbContext context)
    {
        if (await context.Testimonials.AnyAsync()) return;

        var testimonials = new List<Testimonial>
        {
            new()
            {
                CustomerName = "Priya Sharma",
                CustomerTitle = "Mumbai Resident",
                Rating = 5,
                Content = "The mangoes were unbelievably fresh and sweet! You can taste the authentic Ratnagiri flavor in every bite. Best Alphonso mangoes I've had outside of Maharashtra.",
                IsFeatured = true,
                IsApproved = true,
                DisplayOrder = 1
            },
            new()
            {
                CustomerName = "Ramesh Kumar",
                CustomerTitle = "Bangalore Food Lover",
                Rating = 5,
                Content = "I've been using their cold-pressed oils for 6 months now. The groundnut oil has completely transformed my cooking. You can actually taste the difference!",
                IsFeatured = true,
                IsApproved = true,
                DisplayOrder = 2
            },
            new()
            {
                CustomerName = "Neha Joshi",
                CustomerTitle = "Pune Homemaker",
                Rating = 5,
                Content = "Finally found organic jaggery that tastes exactly like what my grandmother used to make! Perfect for making traditional sweets and chai.",
                IsFeatured = true,
                IsApproved = true,
                DisplayOrder = 3
            },
            new()
            {
                CustomerName = "Arjun Patel",
                CustomerTitle = "Delhi Chef",
                Rating = 5,
                Content = "As a professional chef, I'm very particular about ingredient quality. AtYourDoorStep's products have become a staple in my kitchen. Highly recommended!",
                IsFeatured = true,
                IsApproved = true,
                DisplayOrder = 4
            },
            new()
            {
                CustomerName = "Kavitha Reddy",
                CustomerTitle = "Hyderabad Health Enthusiast",
                Rating = 5,
                Content = "Switched to their cold-pressed oils after learning about the health benefits. The sesame oil is pure gold! My family has noticed the difference in taste and health.",
                IsFeatured = true,
                IsApproved = true,
                DisplayOrder = 5
            },
            new()
            {
                CustomerName = "Vikram Singh",
                CustomerTitle = "Gurgaon Executive",
                Rating = 5,
                Content = "Ordered mangoes for a family gathering and everyone was amazed! The packaging was excellent and delivery was right on time. Will definitely order again.",
                IsFeatured = true,
                IsApproved = true,
                DisplayOrder = 6
            }
        };

        await context.Testimonials.AddRangeAsync(testimonials);
    }

    private static async Task SeedSiteSettingsAsync(ContentDbContext context)
    {
        if (await context.SiteSettings.AnyAsync()) return;

        var settings = new List<SiteSetting>
        {
            // Contact settings
            new() { Key = "contact.phone", Value = "+91-8237381312", SettingType = "string", Group = "contact", Description = "Phone Number" },
            new() { Key = "contact.email", Value = "yashturmbekar7@gmail.com", SettingType = "string", Group = "contact", Description = "Email Address" },
            new() { Key = "contact.address", Value = "Pune, Maharashtra, India", SettingType = "string", Group = "contact", Description = "Address" },
            new() { Key = "contact.business_hours", Value = "Mon-Sat, 9AM-7PM", SettingType = "string", Group = "contact", Description = "Business Hours" },

            // Social media settings
            new() { Key = "social.facebook", Value = "https://www.facebook.com/profile.php?id=100074808451374", SettingType = "string", Group = "social", Description = "Facebook URL" },
            new() { Key = "social.instagram", Value = "https://www.instagram.com/gopro.baba/", SettingType = "string", Group = "social", Description = "Instagram URL" },
            new() { Key = "social.twitter", Value = "https://x.com/goprobaba", SettingType = "string", Group = "social", Description = "Twitter URL" },
            new() { Key = "social.linkedin", Value = "https://www.linkedin.com/in/yashturmbekar", SettingType = "string", Group = "social", Description = "LinkedIn URL" },

            // General settings
            new() { Key = "general.site_name", Value = "AtYourDoorStep", SettingType = "string", Group = "general", Description = "Site Name" },
            new() { Key = "general.tagline", Value = "Quality You Can Trust, Delivered", SettingType = "string", Group = "general", Description = "Tagline" },
            new() { Key = "general.description", Value = "AtYourDoorStep is a proudly Indian, family-run business bringing the essence of purity, tradition, and quality directly to your home.", SettingType = "string", Group = "general", Description = "Site Description" },

            // SEO settings
            new() { Key = "seo.home_title", Value = "AtYourDoorStep - Premium Organic Products Delivered", SettingType = "string", Group = "seo", Description = "Home Page Title" },
            new() { Key = "seo.home_description", Value = "Shop premium Alphonso mangoes, organic jaggery, and cold-pressed oils. Direct from farms to your doorstep.", SettingType = "string", Group = "seo", Description = "Home Page Description" },
            new() { Key = "seo.home_keywords", Value = "alphonso mangoes, organic jaggery, cold pressed oil, natural products, farm fresh", SettingType = "string", Group = "seo", Description = "Home Page Keywords" }
        };

        await context.SiteSettings.AddRangeAsync(settings);
    }

    private static async Task SeedHeroSlidesAsync(ContentDbContext context)
    {
        if (await context.HeroSlides.AnyAsync()) return;

        // Get images for hero slides
        var alphonsoSlideImage = GetSeedImage("alphonso", ImageSeeder.HeroSlideImages);
        var oilSlideImage = GetSeedImage("oil", ImageSeeder.HeroSlideImages);
        var jaggerySlideImage = GetSeedImage("jaggery", ImageSeeder.HeroSlideImages);

        var heroSlides = new List<HeroSlide>
        {
            new()
            {
                ProductId = Guid.Parse("10000000-0000-0000-0000-000000000001"),
                Title = "Alphonso Mangoes",
                Subtitle = "AT YOUR DOORSTEP",
                Description = "Experience the king of mangoes - authentic Ratnagiri Alphonso mangoes with unmatched sweetness and aroma.",
                HighlightText = "KING OF MANGOES",
                CtaText = "SHOP NOW",
                CtaLink = "/products/alphonso",
                ImageData = alphonsoSlideImage.Data,
                ImageContentType = alphonsoSlideImage.ContentType,
                GradientStart = "#FF6B35",
                GradientMiddle = "#FFAA00",
                GradientEnd = "#FFE135",
                DisplayOrder = 1,
                IsActive = true,
                Features = new List<HeroSlideFeature>
                {
                    new() { Feature = "Authentic Ratnagiri Origin", DisplayOrder = 1 },
                    new() { Feature = "Peak Ripeness", DisplayOrder = 2 },
                    new() { Feature = "Rich Aroma & Taste", DisplayOrder = 3 },
                    new() { Feature = "Limited Season Availability", DisplayOrder = 4 }
                }
            },
            new()
            {
                ProductId = Guid.Parse("10000000-0000-0000-0000-000000000005"),
                Title = "Cold-Pressed Oils",
                Subtitle = "AT YOUR DOORSTEP",
                Description = "Pure, unrefined oils extracted in our cold-pressing facility using traditional methods. Available in coconut, sesame, groundnut, and mustard varieties.",
                HighlightText = "100% PURE & NATURAL",
                CtaText = "SHOP NOW",
                CtaLink = "/products/oil",
                ImageData = oilSlideImage.Data,
                ImageContentType = oilSlideImage.ContentType,
                GradientStart = "#228B22",
                GradientMiddle = "#32CD32",
                GradientEnd = "#90EE90",
                DisplayOrder = 2,
                IsActive = true,
                Features = new List<HeroSlideFeature>
                {
                    new() { Feature = "Traditional Extraction", DisplayOrder = 1 },
                    new() { Feature = "No Chemical Processing", DisplayOrder = 2 },
                    new() { Feature = "Rich in Nutrients", DisplayOrder = 3 },
                    new() { Feature = "Multiple Varieties", DisplayOrder = 4 }
                }
            },
            new()
            {
                ProductId = Guid.Parse("10000000-0000-0000-0000-000000000003"),
                Title = "Organic Jaggery",
                Subtitle = "AT YOUR DOORSTEP",
                Description = "Pure, organic jaggery made from sugarcane in our processing facility using traditional methods. Rich in minerals and free from chemicals and artificial additives.",
                HighlightText = "CHEMICAL-FREE SWEETNESS",
                CtaText = "SHOP NOW",
                CtaLink = "/products/jaggery",
                ImageData = jaggerySlideImage.Data,
                ImageContentType = jaggerySlideImage.ContentType,
                GradientStart = "#8B4513",
                GradientMiddle = "#CD853F",
                GradientEnd = "#DEB887",
                DisplayOrder = 3,
                IsActive = true,
                Features = new List<HeroSlideFeature>
                {
                    new() { Feature = "Organic Sugarcane", DisplayOrder = 1 },
                    new() { Feature = "No Chemicals Added", DisplayOrder = 2 },
                    new() { Feature = "Rich in Minerals", DisplayOrder = 3 },
                    new() { Feature = "Traditional Process", DisplayOrder = 4 }
                }
            }
        };

        await context.HeroSlides.AddRangeAsync(heroSlides);
    }

    private static async Task SeedStatisticsAsync(ContentDbContext context)
    {
        if (await context.Statistics.AnyAsync()) return;

        var statistics = new List<Statistic>
        {
            // Hero section stats
            new() { Label = "Happy Customers", Value = "5K+", Section = "hero", DisplayOrder = 1, IsActive = true },
            new() { Label = "Direct from Farms", Value = "Fresh", Section = "hero", DisplayOrder = 2, IsActive = true },
            new() { Label = "Natural & Pure", Value = "100%", Section = "hero", DisplayOrder = 3, IsActive = true },

            // About section stats
            new() { Label = "Years of Experience", Value = "30+", Section = "about", DisplayOrder = 1, IsActive = true },
            new() { Label = "Chemical Free", Value = "100%", Section = "about", DisplayOrder = 2, IsActive = true },
            new() { Label = "Premium Products", Value = "3", Section = "about", DisplayOrder = 3, IsActive = true },
            new() { Label = "Happy Customers", Value = "1000+", Section = "about", DisplayOrder = 4, IsActive = true },

            // Why Choose Us section stats
            new() { Label = "Pure & Natural", Value = "100%", Section = "why_choose_us", DisplayOrder = 1, IsActive = true },
            new() { Label = "From Source", Value = "Direct", Section = "why_choose_us", DisplayOrder = 2, IsActive = true },
            new() { Label = "Delivery", Value = "Pan-India", Section = "why_choose_us", DisplayOrder = 3, IsActive = true },
            new() { Label = "Years Experience", Value = "3+", Section = "why_choose_us", DisplayOrder = 4, IsActive = true }
        };

        await context.Statistics.AddRangeAsync(statistics);
    }

    private static async Task SeedUspItemsAsync(ContentDbContext context)
    {
        if (await context.UspItems.AnyAsync()) return;

        var uspItems = new List<UspItem>
        {
            new()
            {
                Title = "Premium Organic Products",
                Description = "Certified organic mangoes, cold-pressed oils, and traditional organic Kolhapuri jaggery. Zero chemicals, zero compromise - just nature's purest goodness.",
                Icon = "organic",
                DisplayOrder = 1,
                IsActive = true
            },
            new()
            {
                Title = "Vertically Integrated Operations",
                Description = "We own our orchards, processing facilities, and distribution network. Complete control ensures consistent quality and freshness.",
                Icon = "integrated",
                DisplayOrder = 2,
                IsActive = true
            },
            new()
            {
                Title = "Nationwide Express Delivery",
                Description = "Fast and reliable delivery service with careful packaging ensures your fresh organic products reach you safely anywhere in India.",
                Icon = "delivery",
                DisplayOrder = 3,
                IsActive = true
            },
            new()
            {
                Title = "Harvest-to-Home Promise",
                Description = "Our mangoes are picked fresh and sent directly to you. They ripen naturally in front of you - no artificial ripening, just nature's perfect timing.",
                Icon = "harvest",
                DisplayOrder = 4,
                IsActive = true
            },
            new()
            {
                Title = "100% Satisfaction Guarantee",
                Description = "Not happy with your order? We offer hassle-free returns and full refunds. Your satisfaction is our top priority.",
                Icon = "satisfaction",
                DisplayOrder = 5,
                IsActive = true
            },
            new()
            {
                Title = "Generational Farming Wisdom",
                Description = "Three generations of sustainable farming practices and traditional processing methods create products with authentic taste and nutrition.",
                Icon = "wisdom",
                DisplayOrder = 6,
                IsActive = true
            }
        };

        await context.UspItems.AddRangeAsync(uspItems);
    }

    private static async Task SeedCompanyStorySectionsAsync(ContentDbContext context)
    {
        if (await context.CompanyStorySections.AnyAsync()) return;

        // Get images for company story sections
        var ourStoryImage = GetSeedImage("our_story", ImageSeeder.CompanyStoryImages);
        var ourSpacesImage = GetSeedImage("our_spaces", ImageSeeder.CompanyStoryImages);
        var ourProductsImage = GetSeedImage("our_products", ImageSeeder.CompanyStoryImages);

        var sections = new List<CompanyStorySection>
        {
            new()
            {
                SectionKey = "our_story",
                Title = "Our Story",
                Icon = "📖",
                ImageData = ourStoryImage.Data,
                ImageContentType = ourStoryImage.ContentType,
                DisplayOrder = 1,
                IsActive = true,
                Items = new List<CompanyStoryItem>
                {
                    new()
                    {
                        Description = "We began over 30 years ago with a small, traditional jaggery unit near sugarcane fields — built on values of purity, tradition, and hard work.",
                        DisplayOrder = 1
                    },
                    new()
                    {
                        Description = "At the heart of this growth lies a simple yet powerful mission: To bring honest, chemical-free, and high-quality products into Indian households, while making the process as easy and accessible as possible.",
                        DisplayOrder = 2
                    },
                    new()
                    {
                        Description = "Today, AtYourDoorstep is more than just a brand — it's a promise of purity with convenience, rooted in Indian traditions and powered by modern delivery.",
                        DisplayOrder = 3
                    }
                }
            },
            new()
            {
                SectionKey = "our_spaces",
                Title = "Our Spaces",
                Icon = "🏭",
                ImageData = ourSpacesImage.Data,
                ImageContentType = ourSpacesImage.ContentType,
                DisplayOrder = 2,
                IsActive = true,
                Items = new List<CompanyStoryItem>
                {
                    new()
                    {
                        Title = "Our Mango Orchards:",
                        Description = "Located in Ratnagiri, thriving on red laterite soil and clean air, producing premium Alphonso mangoes.",
                        DisplayOrder = 1
                    },
                    new()
                    {
                        Title = "Our Jaggery Warehouse:",
                        Description = "Built near sugarcane farms, where juice is boiled in iron pans over firewood, the traditional way.",
                        DisplayOrder = 2
                    },
                    new()
                    {
                        Title = "Our Cold-Pressing Unit:",
                        Description = "Operates in a controlled hygienic environment, where quality seeds are cold-pressed without heat or chemicals.",
                        DisplayOrder = 3
                    }
                }
            },
            new()
            {
                SectionKey = "our_products",
                Title = "Our Products",
                Icon = "🌱",
                ImageData = ourProductsImage.Data,
                ImageContentType = ourProductsImage.ContentType,
                DisplayOrder = 3,
                IsActive = true,
                Items = new List<CompanyStoryItem>
                {
                    new()
                    {
                        Title = "Jaggery:",
                        Description = "With over 30 years in the industry, our jaggery is made using age-old methods in our own processing facility — rich in minerals, free from chemicals.",
                        DisplayOrder = 1
                    },
                    new()
                    {
                        Title = "Cold-Pressed Oils:",
                        Description = "Since 2021, we've been extracting unrefined oils (coconut, sesame, groundnut, mustard) using the traditional wooden ghani method in our cold-pressing facility — keeping nutrients intact.",
                        DisplayOrder = 2
                    },
                    new()
                    {
                        Title = "Mangoes:",
                        Description = "For the past 4 years, we've been delivering carbide-free, naturally ripened Alphonso mangoes from our own orchards in Ratnagiri.",
                        DisplayOrder = 3
                    }
                }
            }
        };

        await context.CompanyStorySections.AddRangeAsync(sections);
    }

    private static async Task SeedInquiryTypesAsync(ContentDbContext context)
    {
        if (await context.InquiryTypes.AnyAsync()) return;

        var inquiryTypes = new List<InquiryType>
        {
            new() { Name = "Product Information", DisplayOrder = 1, IsActive = true },
            new() { Name = "Place an Order", DisplayOrder = 2, IsActive = true },
            new() { Name = "Bulk Orders", DisplayOrder = 3, IsActive = true },
            new() { Name = "Corporate Gifts", DisplayOrder = 4, IsActive = true },
            new() { Name = "Seasonal Offers", DisplayOrder = 5, IsActive = true },
            new() { Name = "Delivery Questions", DisplayOrder = 6, IsActive = true },
            new() { Name = "Customer Support", DisplayOrder = 7, IsActive = true },
            new() { Name = "Other", DisplayOrder = 8, IsActive = true }
        };

        await context.InquiryTypes.AddRangeAsync(inquiryTypes);
    }

    private static async Task SeedDeliverySettingsAsync(ContentDbContext context)
    {
        if (await context.DeliverySettings.AnyAsync()) return;

        var deliverySettings = new DeliverySettings
        {
            FreeDeliveryThreshold = 1000,
            StandardDeliveryCharge = 50,
            ExpressDeliveryCharge = 100,
            IsDeliveryEnabled = true,
            DeliveryNote = "Free delivery on orders above ₹1000"
        };

        await context.DeliverySettings.AddAsync(deliverySettings);
    }
}
