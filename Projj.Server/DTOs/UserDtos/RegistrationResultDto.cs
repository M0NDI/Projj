using Projj.Server.Models;

namespace Projj.Server.DTOs.UserDtos
{
    public class RegistrationResult
    {
        public bool Succeeded { get; set; }
        public ApplicationUser User { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }
}