namespace Shared.Domain.Entities;

/// <summary>
/// Base entity class that all domain entities must inherit from.
/// Provides common properties for entity tracking and auditing.
/// </summary>
public abstract class BaseEntity
{
    /// <summary>
    /// Unique identifier for the entity
    /// </summary>
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// UTC timestamp when the entity was created
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// UTC timestamp when the entity was last updated
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Soft delete flag
    /// </summary>
    public bool IsDeleted { get; set; } = false;

    /// <summary>
    /// UTC timestamp when the entity was deleted (if applicable)
    /// </summary>
    public DateTime? DeletedAt { get; set; }
}
