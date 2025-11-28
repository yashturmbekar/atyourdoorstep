using Microsoft.EntityFrameworkCore;
using ContentService.Domain.Entities;

namespace ContentService.Infrastructure.Persistence;

/// <summary>
/// Entity Framework Core DbContext for ContentService
/// </summary>
public class ContentDbContext : DbContext
{
    public ContentDbContext(DbContextOptions<ContentDbContext> options) : base(options)
    {
    }

    // Product related
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<ProductFeature> ProductFeatures => Set<ProductFeature>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();

    // Content related
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();
    public DbSet<ContentBlock> ContentBlocks => Set<ContentBlock>();
    public DbSet<HeroSlide> HeroSlides => Set<HeroSlide>();
    public DbSet<HeroSlideFeature> HeroSlideFeatures => Set<HeroSlideFeature>();
    public DbSet<Statistic> Statistics => Set<Statistic>();
    public DbSet<UspItem> UspItems => Set<UspItem>();
    public DbSet<CompanyStorySection> CompanyStorySections => Set<CompanyStorySection>();
    public DbSet<CompanyStoryItem> CompanyStoryItems => Set<CompanyStoryItem>();

    // Configuration
    public DbSet<InquiryType> InquiryTypes => Set<InquiryType>();
    public DbSet<DeliverySettings> DeliverySettings => Set<DeliverySettings>();
    public DbSet<ContactSubmission> ContactSubmissions => Set<ContactSubmission>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply snake_case naming convention to all entities
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            // Table name
            entity.SetTableName(ToSnakeCase(entity.GetTableName()!));

            // Column names
            foreach (var property in entity.GetProperties())
            {
                property.SetColumnName(ToSnakeCase(property.Name));
            }

            // Primary and foreign key names
            foreach (var key in entity.GetKeys())
            {
                key.SetName(ToSnakeCase(key.GetName()!));
            }

            // Foreign key names
            foreach (var fk in entity.GetForeignKeys())
            {
                fk.SetConstraintName(ToSnakeCase(fk.GetConstraintName()!));
            }

            // Index names
            foreach (var index in entity.GetIndexes())
            {
                index.SetDatabaseName(ToSnakeCase(index.GetDatabaseName()!));
            }
        }

        // Category configuration
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Slug).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Icon).HasMaxLength(50);

            entity.HasOne(e => e.Parent)
                .WithMany(e => e.Children)
                .HasForeignKey(e => e.ParentId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Product configuration
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Slug).HasMaxLength(200).IsRequired();
            entity.Property(e => e.ShortDescription).HasMaxLength(500);
            entity.Property(e => e.FullDescription).HasMaxLength(2000).IsRequired();
            entity.Property(e => e.SeasonStart).HasMaxLength(20);
            entity.Property(e => e.SeasonEnd).HasMaxLength(20);
            entity.Property(e => e.MetaTitle).HasMaxLength(100);
            entity.Property(e => e.MetaDescription).HasMaxLength(300);

            entity.HasOne(e => e.Category)
                .WithMany(e => e.Products)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ProductVariant configuration
        modelBuilder.Entity<ProductVariant>(entity =>
        {
            entity.Property(e => e.Size).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Unit).HasMaxLength(20).IsRequired();
            entity.Property(e => e.Price).HasPrecision(18, 2);
            entity.Property(e => e.DiscountedPrice).HasPrecision(18, 2);
            entity.Property(e => e.Sku).HasMaxLength(50);
            entity.HasIndex(e => e.Sku).IsUnique().HasFilter("sku IS NOT NULL");

            entity.HasOne(e => e.Product)
                .WithMany(e => e.Variants)
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ProductFeature configuration
        modelBuilder.Entity<ProductFeature>(entity =>
        {
            entity.Property(e => e.Feature).HasMaxLength(200).IsRequired();

            entity.HasOne(e => e.Product)
                .WithMany(e => e.Features)
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ProductImage configuration
        modelBuilder.Entity<ProductImage>(entity =>
        {
            entity.Property(e => e.Url).HasMaxLength(500).IsRequired();
            entity.Property(e => e.AltText).HasMaxLength(200);

            entity.HasOne(e => e.Product)
                .WithMany(e => e.Images)
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Testimonial configuration
        modelBuilder.Entity<Testimonial>(entity =>
        {
            entity.Property(e => e.CustomerName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.CustomerTitle).HasMaxLength(100);
            entity.Property(e => e.Content).HasMaxLength(1000).IsRequired();
        });

        // SiteSetting configuration
        modelBuilder.Entity<SiteSetting>(entity =>
        {
            entity.HasIndex(e => e.Key).IsUnique();
            entity.Property(e => e.Key).HasMaxLength(100).IsRequired();
            entity.Property(e => e.SettingType).HasMaxLength(20).IsRequired();
            entity.Property(e => e.Group).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(500);
        });

        // ContentBlock configuration
        modelBuilder.Entity<ContentBlock>(entity =>
        {
            entity.HasIndex(e => e.BlockKey).IsUnique();
            entity.Property(e => e.BlockKey).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.Subtitle).HasMaxLength(300);
            entity.Property(e => e.Page).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Section).HasMaxLength(50).IsRequired();
        });

        // HeroSlide configuration
        modelBuilder.Entity<HeroSlide>(entity =>
        {
            entity.Property(e => e.Title).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Subtitle).HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.HighlightText).HasMaxLength(50);
            entity.Property(e => e.CtaText).HasMaxLength(50);
            entity.Property(e => e.CtaLink).HasMaxLength(200);
            entity.Property(e => e.GradientStart).HasMaxLength(10);
            entity.Property(e => e.GradientMiddle).HasMaxLength(10);
            entity.Property(e => e.GradientEnd).HasMaxLength(10);

            entity.HasOne(e => e.Product)
                .WithMany()
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // HeroSlideFeature configuration
        modelBuilder.Entity<HeroSlideFeature>(entity =>
        {
            entity.Property(e => e.Feature).HasMaxLength(100).IsRequired();

            entity.HasOne(e => e.HeroSlide)
                .WithMany(e => e.Features)
                .HasForeignKey(e => e.HeroSlideId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Statistic configuration
        modelBuilder.Entity<Statistic>(entity =>
        {
            entity.Property(e => e.Label).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Value).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Section).HasMaxLength(30).IsRequired();
            entity.Property(e => e.Icon).HasMaxLength(50);
        });

        // UspItem configuration
        modelBuilder.Entity<UspItem>(entity =>
        {
            entity.Property(e => e.Title).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(500).IsRequired();
            entity.Property(e => e.Icon).HasMaxLength(50);
        });

        // CompanyStorySection configuration
        modelBuilder.Entity<CompanyStorySection>(entity =>
        {
            entity.HasIndex(e => e.SectionKey).IsUnique();
            entity.Property(e => e.SectionKey).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Title).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Icon).HasMaxLength(50);
        });

        // CompanyStoryItem configuration
        modelBuilder.Entity<CompanyStoryItem>(entity =>
        {
            entity.Property(e => e.Title).HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(1000).IsRequired();

            entity.HasOne(e => e.Section)
                .WithMany(e => e.Items)
                .HasForeignKey(e => e.SectionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // InquiryType configuration
        modelBuilder.Entity<InquiryType>(entity =>
        {
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
        });

        // DeliverySettings configuration
        modelBuilder.Entity<DeliverySettings>(entity =>
        {
            entity.Property(e => e.FreeDeliveryThreshold).HasPrecision(18, 2);
            entity.Property(e => e.StandardDeliveryCharge).HasPrecision(18, 2);
            entity.Property(e => e.ExpressDeliveryCharge).HasPrecision(18, 2);
            entity.Property(e => e.DeliveryNote).HasMaxLength(500);
        });

        // ContactSubmission configuration
        modelBuilder.Entity<ContactSubmission>(entity =>
        {
            entity.HasIndex(e => e.Email);
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Email).HasMaxLength(255).IsRequired();
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.InquiryType).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Message).HasMaxLength(2000).IsRequired();
            entity.Property(e => e.AdminNotes).HasMaxLength(1000);
        });

        // Global query filter for soft delete
        modelBuilder.Entity<Category>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Product>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<ProductVariant>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<ProductFeature>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<ProductImage>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Testimonial>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<SiteSetting>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<ContentBlock>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<HeroSlide>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<HeroSlideFeature>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Statistic>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<UspItem>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<CompanyStorySection>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<CompanyStoryItem>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<InquiryType>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<DeliverySettings>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<ContactSubmission>().HasQueryFilter(e => !e.IsDeleted);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.Entity is Shared.Domain.Entities.BaseEntity &&
                       (e.State == EntityState.Added || e.State == EntityState.Modified));

        foreach (var entry in entries)
        {
            var entity = (Shared.Domain.Entities.BaseEntity)entry.Entity;
            entity.UpdatedAt = DateTime.UtcNow;

            if (entry.State == EntityState.Added)
            {
                entity.CreatedAt = DateTime.UtcNow;
            }
        }
    }

    private static string ToSnakeCase(string input)
    {
        if (string.IsNullOrEmpty(input))
            return input;

        var result = new System.Text.StringBuilder();
        for (int i = 0; i < input.Length; i++)
        {
            var c = input[i];
            if (char.IsUpper(c))
            {
                if (i > 0)
                    result.Append('_');
                result.Append(char.ToLower(c));
            }
            else
            {
                result.Append(c);
            }
        }
        return result.ToString();
    }
}
