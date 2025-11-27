using AuthService.Domain.Entities;

namespace AuthService.Application.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user, List<string> roles);
    string GenerateRefreshToken();
    string HashToken(string token);
    bool VerifyTokenHash(string token, string hash);
}
