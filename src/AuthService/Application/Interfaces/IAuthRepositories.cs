using AuthService.Domain.Entities;
using Shared.Application.Interfaces;

namespace AuthService.Application.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<User?> GetByIdWithRolesAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default);
}

public interface IRefreshTokenRepository : IRepository<RefreshToken>
{
    Task<RefreshToken?> GetValidTokenAsync(string tokenHash, CancellationToken cancellationToken = default);
    Task RevokeAllUserTokensAsync(Guid userId, CancellationToken cancellationToken = default);
}

public interface IRoleRepository : IRepository<Role>
{
    Task<Role?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    Task<List<Role>> GetUserRolesAsync(Guid userId, CancellationToken cancellationToken = default);
}
