using Microsoft.AspNetCore.Identity;
using Projj.Server.DTOs;
using Projj.Server.DTOs.UserDtos;
using Projj.Server.Models;
using System.Security.Claims;

namespace Projj.Server.Services.UserServices
{
    public interface IUserService
    {
        Task<IEnumerable<ApplicationUser>> GetAllUsersAsync();
        Task<ApplicationUser> GetUserByIdAsync(string id);
        Task<ApplicationUser> GetCurrentUserAsync(ClaimsPrincipal userPrincipal);
        Task<RegistrationResult> AddUserAsync(RegisterUserDto model);
        Task<SignInResult> LoginUserAsync(LoginDto model);
        Task<SignInResult> LogOutUserAsync();
        Task<IdentityResult> DeleteCurrentUserAsync(ClaimsPrincipal userPrincipal);
        Task DeleteUserByIdAsync(string id);
        bool VerifyUsername(ClaimsPrincipal userPrincipal, string username);
        Task<bool> IsLoggedIn();
    }
}