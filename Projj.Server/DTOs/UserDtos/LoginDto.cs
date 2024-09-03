using System.ComponentModel.DataAnnotations;

namespace Projj.Server.DTOs.UserDtos
{
    public class LoginDto
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
