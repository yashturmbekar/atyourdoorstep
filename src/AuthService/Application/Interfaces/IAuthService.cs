using AuthService.Application.DTOs;

namespace AuthService.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request, string ipAddress, CancellationToken cancellationToken = default);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request, string ipAddress, CancellationToken cancellationToken = default);
    Task<AuthResponseDto> RefreshTokenAsync(string refreshToken, string ipAddress, CancellationToken cancellationToken = default);
    Task<bool> RevokeTokenAsync(string refreshToken, string ipAddress, CancellationToken cancellationToken = default);
    Task<UserDto?> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken = default);
}
