using Microsoft.EntityFrameworkCore;
using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using AuthService.Domain.Entities;
using AuthService.Domain.Enums;

namespace AuthService.Infrastructure.Services;

public class AuthenticationService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IRoleRepository _roleRepository;
    private readonly ITokenService _tokenService;
    private readonly AuthDbContext _context;

    public AuthenticationService(
        IUserRepository userRepository,
        IRefreshTokenRepository refreshTokenRepository,
        IRoleRepository roleRepository,
        ITokenService tokenService,
        AuthDbContext context)
    {
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _roleRepository = roleRepository;
        _tokenService = tokenService;
        _context = context;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request, string ipAddress, CancellationToken cancellationToken = default)
    {
        // Check if email already exists
        if (await _userRepository.EmailExistsAsync(request.Email, cancellationToken))
        {
            throw new InvalidOperationException("Email already registered");
        }

        // Create new user
        var user = new User
        {
            Email = request.Email,
            PasswordHash = HashPassword(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            IsActive = true
        };

        await _userRepository.AddAsync(user, cancellationToken);

        // Assign default "User" role
        var userRole = await _roleRepository.GetByNameAsync("User", cancellationToken);
        if (userRole != null)
        {
            var userRoleMapping = new UserRole
            {
                UserId = user.Id,
                RoleId = userRole.Id
            };
            await _context.UserRoles.AddAsync(userRoleMapping, cancellationToken);
        }

        await _context.SaveChangesAsync(cancellationToken);

        // Generate tokens
        var roles = new List<string> { "User" };
        return await GenerateAuthResponse(user, roles, ipAddress, cancellationToken);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request, string ipAddress, CancellationToken cancellationToken = default)
    {
        // Find user
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        if (!user.IsActive)
        {
            throw new UnauthorizedAccessException("Account is inactive");
        }

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        // Get roles
        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();

        return await GenerateAuthResponse(user, roles, ipAddress, cancellationToken);
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken, string ipAddress, CancellationToken cancellationToken = default)
    {
        var tokenHash = _tokenService.HashToken(refreshToken);
        var storedToken = await _refreshTokenRepository.GetValidTokenAsync(tokenHash, cancellationToken);

        if (storedToken == null)
        {
            throw new UnauthorizedAccessException("Invalid or expired refresh token");
        }

        // Revoke old token
        storedToken.IsRevoked = true;
        storedToken.RevokedAt = DateTime.UtcNow;
        storedToken.RevokedByIp = ipAddress;
        await _refreshTokenRepository.UpdateAsync(storedToken, cancellationToken);

        // Get user with roles
        var user = await _userRepository.GetByIdWithRolesAsync(storedToken.UserId, cancellationToken);
        if (user == null || !user.IsActive)
        {
            throw new UnauthorizedAccessException("User not found or inactive");
        }

        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();

        // Generate new tokens
        var response = await GenerateAuthResponse(user, roles, ipAddress, cancellationToken);
        
        // Store replacement token reference
        storedToken.ReplacedByToken = response.RefreshToken;
        await _context.SaveChangesAsync(cancellationToken);

        return response;
    }

    public async Task<bool> RevokeTokenAsync(string refreshToken, string ipAddress, CancellationToken cancellationToken = default)
    {
        var tokenHash = _tokenService.HashToken(refreshToken);
        var storedToken = await _refreshTokenRepository.GetValidTokenAsync(tokenHash, cancellationToken);

        if (storedToken == null)
        {
            return false;
        }

        storedToken.IsRevoked = true;
        storedToken.RevokedAt = DateTime.UtcNow;
        storedToken.RevokedByIp = ipAddress;
        await _refreshTokenRepository.UpdateAsync(storedToken, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }

    public async Task<UserDto?> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdWithRolesAsync(userId, cancellationToken);
        if (user == null) return null;

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            PhoneNumber = user.PhoneNumber,
            Roles = user.UserRoles.Select(ur => ur.Role.Name).ToList(),
            CreatedAt = user.CreatedAt
        };
    }

    private async Task<AuthResponseDto> GenerateAuthResponse(User user, List<string> roles, string ipAddress, CancellationToken cancellationToken)
    {
        var accessToken = _tokenService.GenerateAccessToken(user, roles);
        var refreshToken = _tokenService.GenerateRefreshToken();
        var refreshTokenHash = _tokenService.HashToken(refreshToken);

        var refreshTokenEntity = new RefreshToken
        {
            UserId = user.Id,
            Token = refreshToken,
            TokenHash = refreshTokenHash,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedByIp = ipAddress
        };

        await _refreshTokenRepository.AddAsync(refreshTokenEntity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(60),
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Roles = roles,
                CreatedAt = user.CreatedAt
            }
        };
    }

    private static string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    private static bool VerifyPassword(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }
}
