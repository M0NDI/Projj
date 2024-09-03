using System.ComponentModel.DataAnnotations;

namespace Projj.Server.DTOs.UserDtos
{
    public class VerifyUsernameDto
    {
        [Required]
        public string UserName { get; set; } = string.Empty;
    }
}
