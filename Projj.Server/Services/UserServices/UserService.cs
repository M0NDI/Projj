using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Projj.Server.Data;
using Projj.Server.DTOs.UserDtos;
using Projj.Server.Models;
using System.Security.Claims;

namespace Projj.Server.Services.UserServices
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(UserManager<ApplicationUser> userManager,
                           SignInManager<ApplicationUser> signInManager,
                           ApplicationDbContext context,
                           IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<IEnumerable<ApplicationUser>> GetAllUsersAsync()
        {
            var result = await _context.Users
                .Include(u => u.Projects)
                .ThenInclude(p => p.Tasks)
                .ToListAsync();
            return result;
        }

        public async Task<ApplicationUser> GetUserByIdAsync(string id)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                {
                    throw new InvalidOperationException("Error fetching user.");
                }

                user = await _context.Users
                             .Include(u => u.Projects)
                             .SingleOrDefaultAsync(u => u.Id == id);

                return user;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<RegistrationResult> AddUserAsync(RegisterUserDto model)
        {
            try
            {
                // allow user to sign up wither either email or username
                var user = new ApplicationUser
                {
                    UserName = model.UserName,
                    Email = model.Email
                };

                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "User");
                    await _context.SaveChangesAsync();
                    return new RegistrationResult
                    {
                        Succeeded = true,
                        User = user
                    };
                }
                else
                {
                    return new RegistrationResult
                    {
                        Succeeded = false,
                        Errors = result.Errors.Select(e => e.Description).ToList()
                    };
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<SignInResult> LoginUserAsync(LoginDto model)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(model.UserName);
                if (user == null)
                {
                    return SignInResult.Failed;
                }

                var result = await _signInManager.PasswordSignInAsync(model.UserName, model.Password, isPersistent: true, lockoutOnFailure: false);
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<SignInResult> LogOutUserAsync()
        {
            try
            {
                await _signInManager.SignOutAsync();
                return SignInResult.Success;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public bool VerifyUsername(ClaimsPrincipal userPrincipal, string enteredUsername)
        {
            var currentUsername = userPrincipal.Identity.Name;
            if (currentUsername == null)
            {
                throw new InvalidOperationException("Error fetching user.");
            }
            return enteredUsername == currentUsername;
        }

        public async Task<IdentityResult> DeleteCurrentUserAsync(ClaimsPrincipal userPrincipal)
        {
            try
            {
                var currentUser = await _userManager.GetUserAsync(userPrincipal);

                if (currentUser == null)
                {
                    throw new InvalidOperationException("Error fetching user.");
                }

                await _context.SaveChangesAsync();

                return await _userManager.DeleteAsync(currentUser);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task DeleteUserByIdAsync(string id)
        {
            try
            {
                var userToDelete = await _userManager.FindByIdAsync(id);

                if (userToDelete == null)
                {
                    throw new InvalidOperationException("Error fetching user.");
                }

                _context.Users.Remove(userToDelete);
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> IsLoggedIn()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            var loginStatus = await Task.FromResult(user?.Identity?.IsAuthenticated == true);

            return loginStatus;
        }

        public async Task<ApplicationUser> GetCurrentUserAsync(ClaimsPrincipal userPrincipal)
        {
            var currentUser = await _userManager.GetUserAsync(userPrincipal);
            if (currentUser == null)
            {
                throw new InvalidOperationException("Error fetching user.");
            }

            var userWithProjects = await _context.Users
                .Include(u => u.Projects)
                .ThenInclude(t => t.Tasks)
                .FirstOrDefaultAsync(u => u.Id == currentUser.Id);

            if (userWithProjects == null)
            {
                throw new InvalidOperationException("Couldn't fetch user data.");
            }

            return userWithProjects;
        }
    }
}
