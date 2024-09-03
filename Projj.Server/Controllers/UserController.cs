using Google.Apis.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Projj.Server.DTOs;
using Projj.Server.DTOs.UserDtos;
using Projj.Server.Models;
using Projj.Server.Services.UserServices;
using System.Security.Claims;

namespace Projj.Server.Controllers
{
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public UserController(UserService userService, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            _userService = userService;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost]
        [Route("register")]
        public async Task<ActionResult> RegisterUserAsync(RegisterUserDto model)
        {
            var result = await _userService.AddUserAsync(model);
            if (result.Succeeded != false)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> Login([FromBody] LoginDto model)
        {
            var result = await _userService.LoginUserAsync(model);
            return Ok(result);
        }

        [HttpPost("google-auth")]
        public async Task<IActionResult> GoogleAuth([FromBody] GoogleAuthRequest request)
        {
            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(request.Token);

                if (payload == null)
                {
                    return BadRequest("Invalid Google token.");
                }

                var email = payload.Email;

                var user = await _userManager.FindByEmailAsync(email);

                if (user == null)
                {
                    user = new ApplicationUser
                    {
                        UserName = email,
                        Email = email,
                    };

                    var result = await _userManager.CreateAsync(user);

                    if (!result.Succeeded)
                    {
                        return StatusCode(500, "User creation failed.");
                    }
                }

                await _signInManager.SignInAsync(user, isPersistent: true);

                return Ok(new { user, payload });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal server error.");
            }
        }

        [Authorize]
        [HttpGet]
        [Route("logout")]
        public async Task<ActionResult> Logout()
        {
            var result = await _userService.LogOutUserAsync();
            return Ok(result);
        }

        [HttpGet]
        [Route("is-logged-in")]
        public async Task<bool> IsLoggedIn()
        {
            var result = await _userService.IsLoggedIn();
            return result;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("all-users")]
        public async Task<ActionResult> GetAllUsersAsync()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteMyAccount([FromBody] VerifyUsernameDto model)
        {
            var isUsernameValid = _userService.VerifyUsername(User, model.UserName);
            if (!isUsernameValid)
            {
                return BadRequest("Invalid username.");
            }
            var result = await _userService.DeleteCurrentUserAsync(User);

            if (result.Succeeded)
            {
                await _userService.LogOutUserAsync();
                return NoContent();
            }

            return BadRequest(result.Errors);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult> GetUserById(string id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            return Ok(user);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult> DeleteUserById(string id)
        {
            await _userService.DeleteUserByIdAsync(id);
            return Ok();
        }

        [HttpGet]
        [Route("current-user")]
        public async Task<ActionResult> GetCurrentUser()
        {
            var user = await _userService.GetCurrentUserAsync(User);
            return Ok(user);
        }
    }
}
