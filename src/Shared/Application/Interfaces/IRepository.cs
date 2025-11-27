using Shared.Domain.Entities;
using System.Linq.Expressions;

namespace Shared.Application.Interfaces;

/// <summary>
/// Generic repository interface for common data operations
/// </summary>
/// <typeparam name="T">Entity type that inherits from BaseEntity</typeparam>
public interface IRepository<T> where T : BaseEntity
{
    /// <summary>
    /// Gets an entity by its ID
    /// </summary>
    Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all entities
    /// </summary>
    Task<List<T>> GetAllAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Finds entities matching a predicate
    /// </summary>
    Task<List<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets paginated entities
    /// </summary>
    Task<(List<T> Items, int Total)> GetPagedAsync(
        int page, 
        int pageSize, 
        Expression<Func<T, bool>>? filter = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Adds a new entity
    /// </summary>
    Task<T> AddAsync(T entity, CancellationToken cancellationToken = default);

    /// <summary>
    /// Adds multiple entities
    /// </summary>
    Task AddRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing entity
    /// </summary>
    Task UpdateAsync(T entity, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes an entity (soft delete)
    /// </summary>
    Task DeleteAsync(T entity, CancellationToken cancellationToken = default);

    /// <summary>
    /// Permanently deletes an entity
    /// </summary>
    Task HardDeleteAsync(T entity, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if any entity matches the predicate
    /// </summary>
    Task<bool> AnyAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default);

    /// <summary>
    /// Counts entities matching a predicate
    /// </summary>
    Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken cancellationToken = default);
}
